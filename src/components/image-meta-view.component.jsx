const ImageMetaView = ({uploadedFile,imageData}) => {
    return ( 
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 ">
        <div className="flex items-center gap-3 mb-3">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
                <p className="text-gray-300 font-medium">Image loaded successfully</p>
                <p className="text-gray-500 text-sm">
                    {uploadedFile?.name} ({imageData?.width}x{imageData?.height}) 
                    {imageData?.needsConversion && ' - Will be converted to BMP'}
                </p>
            </div>
        </div>
        </div>
     );
}
export default ImageMetaView;