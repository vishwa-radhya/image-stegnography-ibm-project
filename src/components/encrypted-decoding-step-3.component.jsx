const EncryptedDecodingStep3 = ({decodedMessage,resetDecoder}) => {
    return ( 
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
                <button 
                    onClick={resetDecoder} 
                    variant={'outline'} 
                    className="flex-1 text-sm sm:text-base py-3 bg-transparent border border-gray-600
hover:bg-gray-800 hover:text-white hover:border-gray-500
transition-all duration-200 rounded"
                >
                    <div className="flex items-center justify-center gap-2 ">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Decode Another
                    </div>
                </button>
            </div>
        </div>
     );
}
 
export default EncryptedDecodingStep3;