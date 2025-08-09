const EncryptedEncodingStep2 = ({isProcessing}) => {
    return ( 
        <div className="space-y-4">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 sm:p-6">
                <div className="text-center space-y-4">
                    <svg
                        className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400 mx-auto animate-pulse"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                    </svg>
                    <p className="text-gray-300 font-medium mb-2 text-sm sm:text-base">
                        Encrypting Message
                    </p>
                    <p className="text-gray-500 text-xs sm:text-sm">
                        Your message is being encrypted using AES-256 encryption with a unique salt and initialization vector.
                    </p>
                    {isProcessing && (
                        <div className="flex items-center justify-center gap-2 text-purple-400 text-xs sm:text-sm">
                            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-purple-400"></div>
                            Encrypting...
                        </div>
                    )}
                </div>
            </div>
        </div>
     );
}
export default EncryptedEncodingStep2;