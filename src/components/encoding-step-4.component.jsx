const EncodingStep4 = ({isProcessing,resetWizard}) => {
    return ( 
        <div className="space-y-4">
            <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4 sm:p-6">
            <div className="text-center space-y-4">
                <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                </svg>
                <p className="text-green-400 font-medium text-base sm:text-lg mb-2">
                Encoding Complete!
                </p>
                <p className="text-gray-300 text-xs sm:text-sm mb-4">
                Your secret message has been successfully hidden in the image.
                {isProcessing
                    ? " Preparing download..."
                    : " Download started automatically."}
                </p>
                <button
                onClick={resetWizard}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-white bg-[rgba(2,158,12,0.84)] hover:bg-[rgba(2,120,14,0.7)] transition-all duration-200 text-sm sm:text-base"
                >
                Encode Another Message
                </button>
            </div>
            </div>
        </div>
     );
}
export default EncodingStep4;