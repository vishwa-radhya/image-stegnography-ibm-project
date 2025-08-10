const DecodingStep0 = ({handleImageUpload,isEncryptedType=false}) => {
    return ( 
        <div className="space-y-4">
            <div className={`border-2 border-dashed border-gray-600 rounded-lg p-6 sm:p-8 text-center ${!isEncryptedType ? "hover:border-blue-500" : "hover:border-purple-500"} transition-colors`}>
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
                    {isEncryptedType && (
                        <div className="flex items-center gap-1 text-purple-400 text-xs mt-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Encrypted Mode
                        </div>
                    )}
                </label>
            </div>

            {/* Info Panel */}
            <div className={`${!isEncryptedType ? "bg-blue-900/20 border-blue-600/30" : "bg-purple-900/20 border-purple-600/30"} border rounded-lg p-4`}>
                <div className="flex items-start gap-3">
                    <svg className={`w-5 h-5 ${!isEncryptedType ? "text-blue-400" : "text-purple-400"} mt-0.5 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-gray-300">
                        <p className="mb-1 font-medium">
                            {isEncryptedType ? "Encrypted Decoding Notes:" : "Important Notes:"}
                        </p>
                        <ul className="text-xs sm:text-sm text-gray-400 space-y-1">
                            <li>- Only uncompressed 24-bit BMP files are supported. Other formats or compressed BMP variants are not compatible with this tool.</li>
                            <li className="mt-2">
                                - The image must already contain a hidden message encoded using the Least Significant Bit (LSB) steganography method for proper decoding.
                            </li>
                            {isEncryptedType && (
                                <li className="mt-2">
                                    - This image must contain encrypted steganographic data with AES-256 encryption and require a valid password for decryption.
                                </li>
                            )}
                            <li className="mt-2">
                                - For the most reliable results and full compatibility, use images created or processed with this tool's built-in encoder.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
     );
}
export default DecodingStep0;