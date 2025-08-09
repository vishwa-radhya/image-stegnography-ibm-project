
const EncodingStep2 = ({imageData,isProcessing}) => {
    return ( 
        <div className="space-y-4">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 sm:p-6">
                <div className="text-center">
                    {imageData?.isConverted ? (
                        <div className="space-y-4">
                            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mx-auto animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <div>
                                <p className="text-gray-300 font-medium mb-2 text-sm sm:text-base">Converting to BMP format</p>
                                <p className="text-gray-500 text-xs sm:text-sm">
                                    Your image is being converted to BMP format for steganography compatibility.
                                </p>
                            </div>
                            {isProcessing && (
                                <div className="flex items-center justify-center gap-2 text-blue-400 text-xs sm:text-sm">
                                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-400"></div>
                                    Converting...
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                                <p className="text-gray-300 font-medium mb-2 text-sm sm:text-base">Image Ready</p>
                                <p className="text-gray-500 text-xs sm:text-sm">
                                    Your BMP image is ready for steganography processing.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
     );
}
 
export default EncodingStep2;