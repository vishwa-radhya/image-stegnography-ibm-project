import { handleDecodedMessageCopy } from "../utils/helpers";
const DecodingStep2 = ({decodedMessage,resetDecoder}) => {
    return ( 
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
                transition-all duration-200 flex items-center justify-center gap-2" onClick={()=>handleDecodedMessageCopy(decodedMessage)}>
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
    Copy Message
</button>
                )}
            </div>
        </div>
     );
}
 
export default DecodingStep2;