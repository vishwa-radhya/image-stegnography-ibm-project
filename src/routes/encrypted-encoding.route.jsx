import { useState } from "react";
import { encodeMessage, handleImageDataExtraction } from "../utils/image-utils";
import { encryptWithWorker,hashWithWorker } from "../utils/crypto-utils";
import { realtimeDb } from "../utils/firebase";
import { push,ref, update } from "firebase/database";
import { exportStegoBmpAsZip,includeDelay } from "../utils/helpers";
import { toast } from "sonner";
import StegnographyWizardHeader from "../components/stegnography-wizard-header.component";
import { encryptedEncodingSteps } from "../utils/application-data";
import DesktopStepProgress from "../components/desktop-step-progress.coponent";
import MobileStepProgress from "../components/mobile-step-progress.component";
import CurrentStepInfo from "../components/current-step-info.component";
import EncodingStep0 from "../components/encoding-step-0.component";
import EncryptedEncodingStep1 from "../components/encrypted-encoding-step-1.component";
import EncryptedEncodingStep2 from "../components/encrypted-encoding-step-2.component";
import EncryptedEncodingStep5 from "../components/encrypted-encoding-step-5.component";
const EncryptedEncoding = () => {
    const [imageData,setImageData]=useState(null);
    const [requirements,setRequirements]=useState({message:'',password:''});
    const [options,setOptions]=useState({expiryDate:'',expiryCount:0});
    const [currentStep, setCurrentStep] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);

     const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadedFile(file);
        setIsProcessing(true);
        try {
            const result = await handleImageDataExtraction(file);
            setImageData({
                originalBytes: result.bytes,
                width: result.width,
                height: result.height,
                dataOffset: result.dataOffset
            });
            setCurrentStep(1);
            toast.success('Image loaded successfully');
        } catch (err) {
            console.error('Error processing image:', err);
            toast.error('Error extracting image data');
        }
        setIsProcessing(false);
    };
    const handleRequirementsChange = (e) => {
        setRequirements(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleOptionsChange = (e) => {
        setOptions(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleSetExpiryCount=(val)=>{
        const cleanVal = val.replace(/[^0-9]/g, '');
        if (cleanVal === '') {
            setOptions(prev => ({ ...prev, expiryCount: 0 }));
            return;
        }
        let num = parseInt(cleanVal, 10);
        if (num > 9999) num = 9999;
        setOptions(prev => ({ ...prev, expiryCount: num }));
    }
    const handleMessageSubmit = async() => {
        if (!requirements.message.trim()) {
            toast.error('Please enter a message to encrypt');
            return;
        }
        if (!requirements.password || requirements.password.length < 4) {
            toast.error('Password must be at least 4 characters long');
            return;
        }
        await includeDelay(1000)
        setCurrentStep(2);
        processEncryption();
    };
    const processEncryption = async () => {
            if (!imageData || !requirements.message || !requirements.password) {
                toast.error('Missing required data for encryption');
                return;
            }
            setIsProcessing(true);
            try {
                toast.info('Encrypting your message...');
                const { salt, iv, cipherText } = await encryptWithWorker(
                    requirements.message,
                    requirements.password
                );
                await includeDelay(5000)
                setCurrentStep(3);
                toast.info('Storing encrypted data securely...');
                const uniqueId = await pushEncryptedData(salt, iv, cipherText, options.expiryDate, options.expiryCount);
                const stegoBytes = encodeMessage(imageData, uniqueId, 'encrypted');
                if (!stegoBytes) {
                    throw new Error('Failed to embed encrypted data in image');
                }
                await includeDelay(5000)
                setCurrentStep(4);
                toast.info('Creating security verification...');
                const { hash } = await hashWithWorker(stegoBytes);
                const docRef = ref(realtimeDb, `stegMessages/${uniqueId}`);
                await update(docRef, { stegoHash: hash });
                await includeDelay(4500)
                setCurrentStep(5);
                await exportStegoBmpAsZip(stegoBytes, 'encrypted_hidden_message');
                toast.success('Encrypted image ready for download!');
                setIsProcessing(false);
            } catch (error) {
                console.error('Error during encryption process:', error);
                toast.error('Encryption process failed. Please try again.');
                setIsProcessing(false);
            }
        };
        const pushEncryptedData = async (salt, iv, cipherText, expiryDate, expiryCount) => {
            try {
                const docRef = await push(ref(realtimeDb, 'stegMessages'), {
                    salt,
                    iv,
                    cipherText,
                    expiryCount: expiryCount || null,
                    expiryDate: expiryDate || null,
                    createdAt: Date.now(),
                });
                return docRef.key;
            } catch (error) {
                console.error('Error storing encrypted data:', error);
                throw new Error('Failed to store encrypted data');
            }
        };
    const resetWizard = () => {
        setCurrentStep(0);
        setImageData(null);
        setRequirements({ message: '', password: '' });
        setOptions({ expiryDate: '', expiryCount: 0 });
        setUploadedFile(null);
        toast.success('Wizard reset. Ready for new encryption.');
    };
    const resetOptions=()=>{
        setOptions({expiryDate: '', expiryCount: 0})
    }
    return ( 
        <div className="flex flex-col mt-1 gap-6 sm:gap-8 lg:gap-10 rounded-lg p-4 sm:p-6 shadow-2xl border border-gray-600/30 ml-[10px] mr-[10px]" style={{backgroundImage:"linear-gradient(to bottom right, #2b2b2b, #060501, #2b2b2b)"}}>
            <StegnographyWizardHeader heading={'Encrypted Steganography Wizard'} subHeading={'Encrypt and hide your secret message with advanced security features'} />
            <div className="mb-8 sm:mb-8">
                <DesktopStepProgress steps={encryptedEncodingSteps} currentStep={currentStep} isProcessing={isProcessing} />
                <MobileStepProgress steps={encryptedEncodingSteps } currentStep={currentStep} isProcessing={isProcessing} />
                <CurrentStepInfo steps={encryptedEncodingSteps} currentStep={currentStep} />
                <div className="space-y-4 sm:space-y-6">
                    {currentStep==0 && <EncodingStep0 handleImageUpload={handleImageUpload} isProcessing={isProcessing} isEncryptedType={true} />}
                    {currentStep==1 && <EncryptedEncodingStep1 uploadedFile={uploadedFile} resetOptions={resetOptions} imageData={imageData} requirements={requirements} handleRequirementsChange={handleRequirementsChange} options={options} handleOptionsChange={handleOptionsChange} handleExpiryCount={handleSetExpiryCount} handleMessageSubmit={handleMessageSubmit} />}
                    {currentStep==2 && <EncryptedEncodingStep2 isProcessing={isProcessing} currentStep={currentStep} />}
                    {currentStep==3 && <EncryptedEncodingStep2 isProcessing={isProcessing} currentStep={currentStep} />}
                    {currentStep==4 && <EncryptedEncodingStep2 isProcessing={isProcessing} currentStep={currentStep} />}
                    {currentStep==5 && <EncryptedEncodingStep5 isProcessing={isProcessing} resetWizard={resetWizard} />}
                </div>
            </div>
        </div>
     );
}
 
export default EncryptedEncoding;