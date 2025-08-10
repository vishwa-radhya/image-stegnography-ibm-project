import FileMetaViewer from "./file-meta-viewer.component";
import { Button } from "./ui/button";
const EncryptedDecodingStep1 = ({file,password,handleButtonClick,handlePasswordChange}) => {
    return ( 
        <div className="space-y-4">
            <FileMetaViewer file={file} />
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Enter Decryption Password
                </h3>
                <div className="space-y-2">
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Enter decryption password..."
                        minLength={4}
                        maxLength={40}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                    />
                    <p className="text-gray-500 text-xs">Password must be between 4 and 40 characters</p>
                </div>
            </div>
            <Button 
                onClick={handleButtonClick} 
                variant={'secondary'} 
                disabled={!file || !password || password.length < 4 || password.length > 40} 
                className="w-full text-sm sm:text-base py-3"
            >
                <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    Decrypt Hidden Message
                </div>
            </Button>
        </div>
     );
}
export default EncryptedDecodingStep1;