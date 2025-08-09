
const EncodingStep0 = ({handleImageUpload,isProcessing}) => {
    return ( 
        <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 sm:p-8 text-center hover:border-blue-500 transition-colors">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-3">
                    <svg
                    className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                </svg>
                    <p className="text-gray-300 font-medium text-sm sm:text-base">Click to upload an image</p>
                    <p className="text-gray-500 text-xs sm:text-sm">Supports JPG, PNG, BMP, and other formats</p>
                </label>
            </div>
            {isProcessing && (
                <div className="text-center relative top-2 sm:top-4">
                    <div className="inline-flex items-center gap-2 text-blue-400 text-xs sm:text-sm">
                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-400"></div>
                        Analyzing image...
                    </div>
                </div>
            )}
        </div>
     );
}
export default EncodingStep0;