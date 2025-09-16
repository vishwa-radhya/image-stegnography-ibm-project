import { useState } from "react";
import { decodeMessage, handleImageDataExtraction } from "../utils/image-utils";
import { realtimeDb } from "../utils/firebase";
import { get,ref,remove,update } from "firebase/database";
import { decryptWithWorker, hashWithWorker } from "../utils/crypto-utils";
import { toast } from "sonner";
import { includeDelay } from "../utils/helpers";
import StegnographyWizardHeader from "../components/stegnography-wizard-header.component";
import DesktopStepProgress from "../components/desktop-step-progress.coponent";
import { encryptedDecodingSteps } from "../utils/application-data";
import MobileStepProgress from "../components/mobile-step-progress.component";
import CurrentStepInfo from "../components/current-step-info.component";
import DecodingStep0 from "../components/decoding-step-0.component";
import EncryptedDecodingStep1 from "../components/encrypted-decoding-step-1.component";
import EncryptedDecodingStep3 from "../components/encrypted-decoding-step-3.component";

const EncryptedDecoding = () => {
    const [file,setFile]=useState(null);
    const [decodedMessage,setDecodedMessage]=useState('');
    const [password,setPassword]=useState('');
    const [isDecoding, setIsDecoding] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    
    const handleImageUpload=(e)=>{
        setFile(null)
        setDecodedMessage('')
        setPassword('');
        setCurrentStep(0);
        const file = e.target.files[0];
        if(!file) return
        const isBmp = file.name.toLowerCase().endsWith('.bmp');
        if(!isBmp){
            toast.error('Please select a BMP file. Only BMP images are supported for decoding.');
            return;
        }
        setFile(file);
        setCurrentStep(1);
        toast.info('BMP file loaded successfully. Enter the password to decode.');
    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const checkExpiry = async (dbData, docId) => {
        let { expiryCount, expiryDate } = dbData;
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 
        expiryCount=parseInt(expiryCount,10)
        if (expiryDate && today >= expiryDate) {
            await remove(ref(realtimeDb, `stegMessages/${docId}`));
            toast.error('Message has expired and has been deleted.');
            return false;
        }
        if (expiryCount !== undefined && expiryCount <= 0) {
            await remove(ref(realtimeDb, `stegMessages/${docId}`));
            toast.error('Message has reached maximum decode attempts and has been deleted.');
            return false;
        }
        return true;
    };
    const updateExpiryCount = async (docId, currentCount) => {
        if (currentCount !== undefined && currentCount > 0) {
            const newCount = currentCount - 1;
            if (newCount <= 0) {
                await remove(ref(realtimeDb, `stegMessages/${docId}`));
                toast.info('This was the last allowed decode. Message has been deleted.');
            } else {
                await update(ref(realtimeDb, `stegMessages/${docId}`), {
                    expiryCount: newCount
                });
                toast.info(`${newCount} decode attempts remaining.`);
            }
        }
    };
    const handleEncryptedDecode = async (dbData, docId) => {
        if (!dbData || !file) return;

        const { salt, iv, cipherText, expiryCount, stegoHash } = dbData;
        const { bytes } = await handleImageDataExtraction(file);
        const { hash } = await hashWithWorker(bytes);
        
        if (hash !== stegoHash) {
            toast.error('Image has been tampered with. Cannot perform decryption.');
            setDecodedMessage("(Error: Image integrity check failed)");
            await includeDelay(3000);
            setCurrentStep(3);
            return;
        }

        try {
            const plainText = await decryptWithWorker(cipherText, salt, iv, password);
            setDecodedMessage(plainText);
            await includeDelay(3000);
            setCurrentStep(3);
            toast.success('Message decrypted successfully!');
            await updateExpiryCount(docId, parseInt(expiryCount,10));
        } catch (e) {
            console.error(e);
            setDecodedMessage("(Error: Failed to decrypt message - incorrect password)");
            await includeDelay(3000);
            setCurrentStep(3);
            toast.error('Failed to decrypt message. Please check your password.');
        }
    };
    const handleButtonClick = async () => {
        if (!file || !password) {
            toast.error('Please provide both image file and password.');
            return;
        }
        if (password.length < 4 || password.length > 40) {
            toast.error('Password must be between 4 and 40 characters.');
            return;
        }
        setIsDecoding(true);
        setCurrentStep(2);
        try {
            const message = await decodeMessage(file,'encrypted',password);
            const endMarker = '||END||';
            const endIndex = message.indexOf(endMarker);
            if (endIndex !== -1) {
                const validMessage = message.slice(0, endIndex + endMarker.length);
                const docId = validMessage.slice(0, endIndex);
                const dbRef = ref(realtimeDb, `stegMessages/${docId}`);
                const snapshot = await get(dbRef);
                if (snapshot.exists()) {
                    const dbData = snapshot.val();
                    const isValid = await checkExpiry(dbData, docId);
                    if (!isValid) {
                        setDecodedMessage("(Error: Message has expired)");
                        await includeDelay(2000);
                        setCurrentStep(3);
                        setIsDecoding(false);
                        return;
                    }
                    await handleEncryptedDecode(dbData, docId);
                } else {
                    setDecodedMessage("(No encrypted message data found - may have expired)");
                    await includeDelay(2000);
                    setCurrentStep(3);
                    toast.info('No encrypted message data found. The message may have expired.');
                }
            } else {
                setDecodedMessage("(Error: Invalid steganographic image format)");
                await includeDelay(2000);
                setCurrentStep(3);
                toast.error('END marker not found. Image might be corrupted or not a valid encrypted stego image or incorrect password.');
            }
        } catch (e) {
            console.error(e);
            setDecodedMessage("(Error: Failed to decode message)");
            await includeDelay(2000);
            setCurrentStep(3);
            toast.error('Failed to decode message. Make sure it\'s a valid uncompressed 24-bit BMP file.');
        }
        setIsDecoding(false);
    };
    const resetDecoder = () => {
        setFile(null);
        setDecodedMessage('');
        setPassword('');
        setCurrentStep(0);
    };
    return ( 
        <div className="w-full mx-auto px-2 sm:px-4">
            <div className="flex flex-col mt-1 gap-6 sm:gap-8 lg:gap-10 rounded-lg p-4 sm:p-6 shadow-2xl border border-gray-600/30" 
                style={{ backgroundImage: 'linear-gradient(to bottom right, #2b2b2b, #060501, #2b2b2b)' }}>
                <StegnographyWizardHeader heading={'Encrypted Steganography Decoder'} subHeading={'Extract and decrypt hidden messages from encrypted steganographic BMP images'} />
                <div className="mb-6 sm:mb-8">
                    <DesktopStepProgress steps={encryptedDecodingSteps} currentStep={currentStep} isProcessing={isDecoding}  />
                    <MobileStepProgress steps={encryptedDecodingSteps} currentStep={currentStep} isProcessing={isDecoding} />
                    <CurrentStepInfo steps={encryptedDecodingSteps} currentStep={currentStep} />
                    <div className="space-y-4 sm:space-y-6">
                        {currentStep===0 && <DecodingStep0 handleImageUpload={handleImageUpload} isEncryptedType={true} />}
                        {currentStep===1 && <EncryptedDecodingStep1 file={file} password={password} handleButtonClick={handleButtonClick} handlePasswordChange={handlePasswordChange} />}
                        {currentStep === 2 && (
                            <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6">
                                <div className="text-center">
                                    <div className="relative w-16 h-16 mx-auto mb-4">
                                        <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400"></div>
                                        <svg className="w-8 h-8 text-blue-400 absolute top-4 left-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-300 font-medium mb-2 text-sm sm:text-base">Decrypting Message</p>
                                    <p className="text-gray-500 text-xs sm:text-sm">Extracting and decrypting hidden data using AES-256 encryption...</p>
                                </div>
                            </div>
                        )}
                        {currentStep === 3 && <EncryptedDecodingStep3 decodedMessage={decodedMessage} resetDecoder={resetDecoder} />}
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default EncryptedDecoding;