const EncryptedEncodingStep3 = ({isProcessing}) => {
    return ( 
        <div className="space-y-4">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 sm:p-6">
                <div className="text-center space-y-4">
                    <svg
                        className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mx-auto animate-pulse"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <p className="text-gray-300 font-medium mb-2 text-sm sm:text-base">
                        Embedding Encrypted Data
                    </p>
                    <p className="text-gray-500 text-xs sm:text-sm">
                        The encrypted message ID is being embedded into the image using LSB steganography.
                    </p>
                    {isProcessing && (
                        <div className="flex items-center justify-center gap-2 text-blue-400 text-xs sm:text-sm">
                            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-400"></div>
                            Embedding...
                        </div>
                    )}
                </div>
            </div>
        </div>
     );
}
export default EncryptedEncodingStep3;