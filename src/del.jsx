import { useState } from "react";
import { decodeMessage, handleImageDataExtraction } from "../utils/image-utils";
import { realtimeDb } from "../utils/firebase";
import { get, ref, update, remove } from "firebase/database";
import { decryptWithWorker, hashWithWorker } from "../utils/crypto-utils";
import { encryptedDecodingSteps } from "../utils/application-data";
import { toast } from "sonner";
import { includeDelay } from "../utils/helpers";
import { Button } from "../components/ui/button";
import StegnographyWizardHeader from "../components/stegnography-wizard-header.component";
import DesktopStepProgress from "../components/desktop-step-progress.coponent";
import MobileStepProgress from "../components/mobile-step-progress.component";
import CurrentStepInfo from "../components/current-step-info.component";
import FileMetaViewer from "../components/file-meta-viewer.component";

const EncryptedDecoding = () => {
    const [file, setFile] = useState(null);
    const [decodedMessage, setDecodedMessage] = useState('');
    const [password, setPassword] = useState('');
    const [isDecoding, setIsDecoding] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const handleImageUpload = async (e) => {
        setFile(null);
        setDecodedMessage('');
        setPassword('');
        setCurrentStep(0);
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        
        const isBmp = selectedFile.name.toLowerCase().endsWith('.bmp');
        if (!isBmp) {
            toast.error('Please select a BMP file. Only BMP images are supported for decoding.');
            return;
        }
        
        setFile(selectedFile);
        setCurrentStep(1);
        toast.info('BMP file loaded successfully. Enter password to decode.');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const checkExpiry = async (dbData, docId) => {
        const { expiryCount, expiryDate } = dbData;
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

        // Check expiry date
        if (expiryDate && today >= expiryDate) {
            await remove(ref(realtimeDb, `stegMessages/${docId}`));
            toast.error('Message has expired and has been deleted.');
            return false;
        }

        // Check expiry count
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

        const { salt, iv, cipherText, expiryCount, expiryDate, createdAt, stegoHash } = dbData;
        
        // Extract image bytes and verify integrity
        const { bytes } = await handleImageDataExtraction(file);
        const { hash } = await hashWithWorker(bytes);
        
        if (hash !== stegoHash) {
            toast.error('Image has been tampered with. Cannot perform decryption.');
            setDecodedMessage("(Error: Image integrity check failed)");
            await includeDelay(2000);
            setCurrentStep(3);
            return;
        }

        try {
            const plainText = await decryptWithWorker(cipherText, salt, iv, password);
            setDecodedMessage(plainText);
            await includeDelay(2000);
            setCurrentStep(3);
            toast.success('Message decrypted successfully!');
            
            // Update expiry count after successful decryption
            await updateExpiryCount(docId, expiryCount);
        } catch (e) {
            console.error(e);
            setDecodedMessage("(Error: Failed to decrypt message - incorrect password)");
            await includeDelay(2000);
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
            const message = await decodeMessage(file);
            const endMarker = '||END||';
            const endIndex = message.indexOf(endMarker);

            if (endIndex !== -1) {
                const validMessage = message.slice(0, endIndex + endMarker.length);
                const docId = validMessage.slice(0, endIndex);
                const dbRef = ref(realtimeDb, `stegMessages/${docId}`);
                const snapshot = await get(dbRef);

                if (snapshot.exists()) {
                    const dbData = snapshot.val();
                    
                    // Check expiry before proceeding
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
                toast.error('END marker not found. Image might be corrupted or not a valid encrypted stego image.');
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
                
                <StegnographyWizardHeader 
                    heading={'Encrypted Steganography Decoder'} 
                    subHeading={'Extract and decrypt hidden messages from encrypted steganographic BMP images'} 
                />

                <div className="mb-6 sm:mb-8">
                    <DesktopStepProgress steps={encryptedDecodingSteps} currentStep={currentStep} isProcessing={isDecoding} />
                    <MobileStepProgress steps={encryptedDecodingSteps} currentStep={currentStep} isProcessing={isDecoding} />
                    <CurrentStepInfo steps={encryptedDecodingSteps} currentStep={currentStep} />
                    
                    <div className="space-y-4 sm:space-y-6">
                        {/* Step 0: File Upload */}
                        {currentStep === 0 && (
                            <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6">
                                <div className="text-center mb-6">
                                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Upload Encrypted Steganographic Image</h3>
                                    <p className="text-gray-400 text-sm sm:text-base">Select a BMP image file that contains an encrypted hidden message</p>
                                </div>
                                
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".bmp"
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors">
                                        <svg className="w-8 h-8 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <p className="text-gray-400 text-sm sm:text-base">Click to browse or drag and drop your BMP file here</p>
                                        <p className="text-gray-500 text-xs mt-2">Only uncompressed 24-bit BMP files are supported</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 1: Password Input */}
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <FileMetaViewer file={file} />
                                
                                <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Enter Decryption Password
                                    </h3>
                                    
                                    <div className="space-y-2">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            placeholder="Enter decryption password..."
                                            minLength={4}
                                            maxLength={40}
                                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                                        />
                                        <p className="text-gray-500 text-xs">Password must be between 4 and 40 characters</p>
                                    </div>
                                </div>

                                <Button 
                                    onClick={handleButtonClick} 
                                    variant={'secondary'} 
                                    disabled={!file || !password || password.length < 4 || password.length > 40} 
                                    className="w-full text-sm sm:text-base py-3"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                        </svg>
                                        Decrypt Hidden Message
                                    </div>
                                </Button>
                            </div>
                        )}

                        {/* Step 2: Processing */}
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

                        {/* Step 3: Results */}
                        {currentStep === 3 && (
                            <div className="space-y-4">
                                <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Decrypted Message
                                    </h3>
                                    
                                    <textarea
                                        readOnly
                                        value={decodedMessage}
                                        placeholder="Decrypted message will appear here..."
                                        className="w-full h-40 px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none text-sm sm:text-base"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button 
                                        onClick={resetDecoder} 
                                        variant={'outline'} 
                                        className="flex-1 text-sm sm:text-base py-3"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Decode Another
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EncryptedDecoding;