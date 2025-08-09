import { ShieldCheck,CloudCheck,RotateCcwKey,GlobeLock } from "lucide-react";
const EncryptedEncodingStep5 = ({isProcessing,resetWizard}) => {
    return ( 
        <div className="space-y-4">
            <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4 sm:p-6">
                <div className="text-center space-y-4">
                    <GlobeLock className="mx-auto" color="#0fd11c" size={'35px'} />
                    <p className="text-green-400 font-medium text-base sm:text-lg mb-2">
                        Encrypted Encoding Complete!
                    </p>
                    <div className="space-y-2 text-xs sm:text-sm text-gray-300">
                        <p>Your secret message has been encrypted and hidden in the image.</p>
                        <div className="bg-gray-800/50 border border-gray-700 rounded p-3 text-left">
                            <p className="text-yellow-400 font-medium mb-1">Security Features Applied:</p>
                            <ul className="space-y-1 text-gray-400">
                                <li>- AES-256 encryption with unique salt</li>
                                <li>- Steganographic embedding using LSB</li>
                                <li>- Integrity verification hash</li>
                                <li>- Secure cloud storage of encryption keys</li>
                            </ul>
                        </div>
                        <p className="text-gray-300">
                            {isProcessing ? "Preparing secure download..." : "Download started automatically."}
                        </p>
                    </div>
                    <button
                        onClick={resetWizard}
                        className="w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-white 
                                   bg-transparent border border-gray-600
                hover:bg-gray-800 hover:text-white hover:border-gray-500
                transition-all duration-200 text-sm sm:text-base"
                    >
                        Encrypt Another Message
                    </button>
                </div>
            </div>
        </div>
     );
}
 
export default EncryptedEncodingStep5;