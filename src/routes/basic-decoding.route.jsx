import { useState } from "react";
import { decodeMessage } from "../utils/image-utils";
import { basicDecodingSteps } from "../utils/application-data";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import StegnographyWizardHeader from "../components/stegnography-wizard-header.component";
import DesktopStepProgress from "../components/desktop-step-progress.coponent";
import MobileStepProgress from "../components/mobile-step-progress.component";
import CurrentStepInfo from "../components/current-step-info.component";
import DecodingStep0 from "../components/decoding-step-0.component";
import DecodingStep2 from "../components/decoding-step-2.component";

const BasicDecoding = () => {
    const [file,setFile]=useState(null);
    const [decodedMessage,setDecodedMessage]=useState('');
    const [isDecoding, setIsDecoding] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const handleImageUpload = async (e) => {
        setFile(null);
        setDecodedMessage('');
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
        toast.info('BMP file loaded successfully. Ready to decode.');
    };
    const handleButtonClick = async () => {
        if (!file) return;
        setIsDecoding(true);
        try {
            const message = await decodeMessage(file);
            if (message) {
                setDecodedMessage(message);
                setCurrentStep(2);
                toast.success('Message decoded successfully!');
            } else {
                setDecodedMessage("(No hidden message found in this image)");
                setCurrentStep(2);
                toast.info('No hidden message found in the image.');
            }
        } catch (e) {
            console.error(e);
            setDecodedMessage("(Error: Failed to decode message)");
            toast.error('Failed to decode message. Make sure it\'s a valid uncompressed 24-bit BMP file.');
        }
        setIsDecoding(false);
    };
    const resetDecoder = () => {
        setFile(null);
        setDecodedMessage('');
        setCurrentStep(0);
    };

    return ( 
        <div className="w-full mx-auto px-2 sm:px-4">
            <div className="flex flex-col mt-1 gap-6 sm:gap-8 lg:gap-10 rounded-lg p-4 sm:p-6 shadow-2xl border border-gray-600/30" 
                style={{ backgroundImage: 'linear-gradient(to bottom right, #2b2b2b, #060501, #2b2b2b)' }}>
                <StegnographyWizardHeader heading={'Steganography Decoder'} subHeading={' Extract hidden messages from steganographic BMP images'} />
                <div className="mb-6 sm:mb-8">
                    <DesktopStepProgress steps={basicDecodingSteps} currentStep={currentStep} isProcessing={isDecoding} />
                    <MobileStepProgress steps={basicDecodingSteps} currentStep={currentStep} isProcessing={isDecoding} />
                    <CurrentStepInfo steps={basicDecodingSteps} currentStep={currentStep} />
                    <div className="space-y-4 sm:space-y-6">
                        {currentStep === 0 && <DecodingStep0 handleImageUpload={handleImageUpload}/>}
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-3 sm:p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                                        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <div className="min-w-0">
                                            <p className="text-gray-300 font-medium text-sm sm:text-base">
                                                BMP file loaded successfully
                                            </p>
                                            <p className="text-gray-500 text-xs sm:text-sm break-all sm:break-normal">
                                                {file?.name} ({(file?.size / 1024).toFixed(1)} KB)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <Button 
                                    onClick={handleButtonClick} 
                                    variant={'secondary'}
                                    disabled={!file || isDecoding}
                                    className="w-full text-sm sm:text-base py-3"
                                >
                                    {isDecoding ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Decoding...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            Decode Hidden Message
                                        </div>
                                    )}
                                </Button>
                                {isDecoding && (
                                    <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
                                        <div className="text-center">
                                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400 mx-auto animate-pulse mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <p className="text-gray-300 font-medium mb-2 text-sm sm:text-base">
                                                Analyzing Image Pixels
                                            </p>
                                            <p className="text-gray-500 text-xs sm:text-sm">
                                                Extracting hidden data using LSB steganography algorithm...
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {currentStep === 2 && <DecodingStep2 decodedMessage={decodedMessage} resetDecoder={resetDecoder} /> }
                    </div>
                </div>
            </div>
        </div>
     );
}
export default BasicDecoding;