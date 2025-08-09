const EncryptedEncodingStep4 = ({isProcessing}) => {
    return ( 
        <div className="space-y-4">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 sm:p-6">
                <div className="text-center space-y-4">
                    <svg
                        className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400 mx-auto animate-pulse"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    <p className="text-gray-300 font-medium mb-2 text-sm sm:text-base">
                        Finalizing Security
                    </p>
                    <p className="text-gray-500 text-xs sm:text-sm">
                        Creating security hash and storing encryption metadata securely.
                    </p>
                    {isProcessing && (
                        <div className="flex items-center justify-center gap-2 text-yellow-400 text-xs sm:text-sm">
                            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-yellow-400"></div>
                            Securing...
                        </div>
                    )}
                </div>
            </div>
        </div>
     );
}
 
export default EncryptedEncodingStep4;