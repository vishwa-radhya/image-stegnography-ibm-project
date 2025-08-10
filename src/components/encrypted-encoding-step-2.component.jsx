const EncryptedEncodingStep2 = ({ isProcessing, currentStep }) => {
    const getPathD = () => {
        switch (currentStep) {
            case 2:
                return "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z";
            case 3:
                return "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z";
            case 4:
                return "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"; 
            default:
                return "";
        }
    };
    return (
        <div className="space-y-4">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 sm:p-6">
                <div className="text-center space-y-4">
                    <svg
                        className={`w-10 h-10 sm:w-12 sm:h-12 ${
                            currentStep === 2 && "text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]"
                        } ${currentStep === 3 && "text-blue-400 drop-shadow-[0_0_6px_rgba(96,165,250,0.8)]"} ${
                            currentStep === 4 && "text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]"
                        } mx-auto animate-pulse`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={getPathD()}
                        />
                    </svg>

                    <p className="text-gray-300 font-medium mb-2 text-sm sm:text-base">
                        {currentStep === 2 && "Encrypting Message"}
                        {currentStep === 3 && "Embedding Encrypted Message"}
                        {currentStep === 4 && "Finalizing Security"}
                    </p>

                    <p className="text-gray-500 text-xs sm:text-sm">
                        {currentStep === 2 &&
                            "Your message is being encrypted using AES-256 encryption with a unique salt and initialization vector."}
                        {currentStep === 3 &&
                            "The encrypted message ID is being embedded into the image using LSB steganography."}
                        {currentStep === 4 &&
                            "Creating security hash and storing encryption metadata securely."}
                    </p>

                    {isProcessing && (
                        <div
                            className={`flex items-center justify-center gap-2 ${
                                currentStep === 2 && "text-purple-400"
                            } ${currentStep === 3 && "text-blue-400"} ${
                                currentStep === 4 && "text-yellow-400"
                            } text-xs sm:text-sm`}
                        >
                            <div
                                className={`animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 ${
                                currentStep === 2 && "border-purple-400"
                            } ${currentStep === 3 && "border-blue-400"} ${
                                currentStep === 4 && "border-yellow-400"
                            }`}
                            ></div>
                            {currentStep === 2 && "Encrypting..."}
                            {currentStep === 3 && "Embedding..."}
                            {currentStep === 4 && "Securing..."}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EncryptedEncodingStep2;
