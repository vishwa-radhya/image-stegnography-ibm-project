const FileMetaViewer = ({file}) => {
    return ( 
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div className="min-w-0">
                    <p className="text-gray-300 font-medium text-sm sm:text-base">
                        BMP file loaded successfully
                    </p>
                    <p className="text-gray-500 text-xs sm:text-sm break-all sm:break-normal">
                        {file?.name} ({(file?.size / 1024).toFixed(1)} KB)
                    </p>
                </div>
            </div>
        </div>
     );
}
 
export default FileMetaViewer;