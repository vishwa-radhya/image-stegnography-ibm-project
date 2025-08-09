import { Button } from "./ui/button";
import ImageMetaView from "./image-meta-view.component";
const EncryptedEncodingStep1 = ({uploadedFile, 
    imageData, 
    requirements, 
    handleRequirementsChange, 
    options, 
    handleOptionsChange,handleExpiryCount, resetOptions,
    handleMessageSubmit}) => {
        const isPasswordValid = requirements.password.length >= 4 && requirements.password.length <= 40;
            const isMessageValid = requirements.message.trim().length > 0;
            const isFormValid = isPasswordValid && isMessageValid;
            const getTomorrowDate = () => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                return tomorrow.toISOString().split('T')[0];
            };
            return (
                <div className="space-y-4">
                    <ImageMetaView uploadedFile={uploadedFile} imageData={imageData} />
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Secret Message</label>
                        <textarea 
                            placeholder="Enter your secret message here..." 
                            className="w-full h-32 p-4 bg-gray-800/50 border border-gray-600 rounded-lg
                                      text-gray-100 placeholder-gray-500 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                            value={requirements.message} 
                            onChange={handleRequirementsChange}
                            name="message"
                            maxLength={700} 
                        />
                        <p className="text-xs text-gray-500">{requirements.message.length}/700 characters</p>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Encryption Password</label>
                        <input
                            type="password"
                            placeholder="Enter a strong password (4-40 characters)"
                            className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-lg
                                      text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            value={requirements.password}
                            onChange={handleRequirementsChange}
                            name="password"
                            minLength={4}
                            maxLength={40}
                        />
                        <div className="flex items-center gap-2 text-xs">
                            <div className={`w-2 h-2 rounded-full ${isPasswordValid ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                            <span className={isPasswordValid ? 'text-green-400' : 'text-gray-500'}>
                                Password length: {requirements.password.length}/40 {isPasswordValid ? '✓' : ''}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Security Options (Optional)</label>
                        <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Expiry Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded text-gray-100 text-sm
                                                focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        name="expiryDate"
                                        onChange={handleOptionsChange}
                                        value={options.expiryDate}
                                        min={getTomorrowDate()} 
                                        title="Please select a future date"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Access Limit</label>
                                    <input
                                        type="number"
                                        placeholder="Max decryptions (0 = unlimited)"
                                        className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded text-gray-100 text-sm
                                                  focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        name="expiryCount"
                                        onChange={(e)=>handleExpiryCount(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (["-", "+", "e", "E"].includes(e.key)) {
                                            e.preventDefault();
                                            }
                                        }}
                                        value={options.expiryCount}
                                        min="0"
                                        max="9999"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">
                                Set optional security constraints for your encrypted message
                            </p>
                            <Button variant={'secondary'} onClick={resetOptions}  >Clear</Button>
                        </div>
                    </div>
        
                    <Button 
                        onClick={handleMessageSubmit} 
                        variant={'secondary'} 
                        disabled={!isFormValid} 
                        className="w-full text-[16px]"
                    >
                        Continue to Encryption
                    </Button>
                </div>
     );
}
 
export default EncryptedEncodingStep1;