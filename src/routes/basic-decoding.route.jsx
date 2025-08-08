import { useState } from "react";
import { decodeMessage } from "../utils/image-utils";
import { basicDecodingSteps } from "../utils/application-data";
import { toast } from "sonner";
import { Button } from "../components/ui/button";

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
    const getStepStatus = (stepIndex) => {
        if (stepIndex < currentStep) return 'completed';
        if (stepIndex === currentStep) return 'active';
        return 'pending';
    };
    const getStepIcon = (stepIndex, status) => {
        if (status === 'completed') {
            return (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" className="text-white" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            );
        }
        if (status === 'active' && isDecoding) {
            return <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-400"></div>;
        }
        return <span className="text-xs sm:text-sm font-medium">{stepIndex + 1}</span>;
    };
    const handleDecodedMessageCopy=()=>{
        if(decodedMessage){
            navigator.clipboard?.writeText(decodedMessage)
            toast.success('Decoded message copied to clipboard')
        }else{
            toast.error('No decoded message to copy')
        }
    }

    return ( 
        <div className="w-full mx-auto px-2 sm:px-4">
            <div className="flex flex-col mt-1 gap-6 sm:gap-8 lg:gap-10 rounded-lg p-4 sm:p-6 shadow-2xl border border-gray-600/30" 
                style={{ backgroundImage: 'linear-gradient(to bottom right, #2b2b2b, #060501, #2b2b2b)' }}>
                <div className="mb-4 sm:mb-6 lg:mb-8">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 text-center">
                        Steganography Decoder
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base text-center pt-2 sm:pt-3 px-2">
                        Extract hidden messages from steganographic BMP images
                    </p>
                </div>
                <div className="mb-6 sm:mb-8">
                {/* desktop Step Progress */}
                    <div className="hidden sm:flex items-center justify-center mb-4 space-x-8">
                        {basicDecodingSteps.map((step, index) => {
                            const status = getStepStatus(index);
                            return (
                                <div key={`step-${index}`} className="flex items-center">
                                    <div className={`
                                        flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 transition-all duration-300
                                        ${status === 'completed' ? 'bg-green-500 border-green-500' : 
                                          status === 'active' ? 'bg-blue-600 border-blue-500' : 
                                          'bg-gray-700 border-gray-600'}
                                    `}>
                                        {getStepIcon(index, status)}
                                    </div>
                                    {index < basicDecodingSteps.length - 1 && (
                                        <div className={`
                                            w-16 lg:w-20 h-0.5 mx-4 transition-all duration-300
                                            ${status === 'completed' ? 'bg-green-500' : 'bg-gray-600'}
                                        `} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    {/* Mobile Step Progress */}
                    <div className="sm:hidden flex justify-center mb-4">
                        <div className="flex items-center space-x-3">
                            {basicDecodingSteps.map((_, index) => {
                                const status = getStepStatus(index);
                                return (
                                    <div key={`mobile-step-${index}`} className={`
                                        w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300
                                        ${status === 'completed' ? 'bg-green-500 border-green-500' : 
                                          status === 'active' ? 'bg-blue-600 border-blue-500' : 
                                          'bg-gray-700 border-gray-600'}
                                    `}>
                                        {getStepIcon(index, status)}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {/* Current Step Info */}
                    <div className="text-center flex flex-col gap-2 sm:gap-2.5 pt-2 sm:pt-3.5 pb-3 sm:pb-5 px-2">
                        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white">
                            {basicDecodingSteps[currentStep]?.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-400">
                            {basicDecodingSteps[currentStep]?.description}
                        </p>
                    </div>
                    {/* Steps content */}
                    <div className="space-y-4 sm:space-y-6">
                        {currentStep === 0 && (
                            <div className="space-y-4">
                                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 sm:p-8 text-center hover:border-blue-500 transition-colors">
                                    <input
                                        type="file"
                                        accept=".bmp"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="bmp-upload"
                                    />
                                    <label htmlFor="bmp-upload" className="cursor-pointer flex flex-col items-center gap-3">
                                        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="text-gray-300 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                                            Click to upload a BMP image
                                        </p>
                                        <p className="text-gray-500 text-xs sm:text-sm">
                                            Only BMP files are supported for decoding
                                        </p>
                                    </label>
                                </div>

                                {/* Info Panel */}
                                <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div className="text-sm text-gray-300">
                                            <p className="mb-1 font-medium">Important Notes:</p>
                                            <ul className="text-xs sm:text-sm text-gray-400 space-y-1">
                                                <li >- Only uncompressed 24-bit BMP files are supported. Other formats or compressed BMP variants are not compatible with this tool. </li>
                                                <li className="mt-2">- The image must already contain a hidden message encoded using the Least Significant Bit (LSB) steganography method for proper decoding.</li>
                                                <li className="mt-2">- For the most reliable results and full compatibility, use images created or processed with this tool built-in encoder.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
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
                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <div className={`rounded-lg p-4 sm:p-6 border ${
                                    decodedMessage.includes('(No hidden message found)') || decodedMessage.includes('(Error:') 
                                        ? 'bg-orange-900/20 border-orange-600/30' 
                                        : 'bg-green-900/20 border-green-600/30'
                                }`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        {decodedMessage.includes('(No hidden message found)') || decodedMessage.includes('(Error:') ? (
                                            <svg className="w-6 h-6 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                        <h3 className="text-base sm:text-lg font-semibold text-white">
                                            Decoding Result
                                        </h3>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-gray-300">
                                            {decodedMessage.includes('(No hidden message found)') ? 'Status:' : 
                                             decodedMessage.includes('(Error:') ? 'Error:' : 'Decoded Message:'}
                                        </label>
                                        <textarea 
                                            readOnly 
                                            value={decodedMessage} 
                                            className="w-full h-24 sm:h-32 p-3 sm:p-4 bg-gray-800/50 border border-gray-600 rounded-lg
                                                     text-gray-100 resize-none text-sm sm:text-base
                                                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Decoded message will appear here..."
                                        />
                                        {decodedMessage && !decodedMessage.includes('(No hidden message found)') && !decodedMessage.includes('(Error:') && (
                                            <p className="text-xs text-gray-500">
                                                Message length: {decodedMessage.length} characters
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={resetDecoder} className="flex-1 px-4 sm:px-6 py-3 rounded-lg font-medium text-gray-300 text-sm sm:text-base
                                   bg-transparent border border-gray-600
                                   hover:bg-gray-800 hover:text-white hover:border-gray-500
                                   transition-all duration-200">
                        Decode Another Image
                    </button>
                                    
                                    {decodedMessage && !decodedMessage.includes('(No hidden message found)') && !decodedMessage.includes('(Error:') && (
                                        <button className="flex-1 px-4 sm:px-6 py-3 rounded-lg font-medium text-gray-300 text-sm sm:text-base
                                   bg-transparent border border-gray-500
                                   hover:bg-gray-800 hover:text-white hover:border-gray-400
                                   transition-all duration-200 flex items-center justify-center gap-2" onClick={handleDecodedMessageCopy}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Message
                    </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default BasicDecoding;