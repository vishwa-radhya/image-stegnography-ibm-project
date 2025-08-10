import { getStepStatus,getStepIcon } from "../utils/helpers";
const DesktopStepProgress = ({steps,currentStep,isProcessing}) =>{
    const isLongFlow = steps.length > 4;
    return ( 
        <div className={`hidden sm:flex items-center justify-center mb-4 ${isLongFlow ? 'space-x-3 lg:space-x-6' : 'space-x-8'}`}>
            {steps.map((step, index) => {
                const status = getStepStatus(index, currentStep);
                return (
                    <div key={`step-ph-${index}`} className="flex items-center">
                        <div className={`flex items-center justify-center rounded-full border-2 transition-all duration-300 text-xs sm:text-sm ${isLongFlow ? 'w-8 h-8 sm:w-9 sm:h-9' : 'w-9 h-9 sm:w-[42px] sm:h-10'} ${status === 'completed' ? 'bg-green-500 border-green-500' : 
                                status === 'active' ? 'bg-blue-600 border-blue-500' : 'bg-gray-700 border-gray-600'}`}>
                            {getStepIcon(index, status, isProcessing)}
                        </div>
                        {index < steps.length - 1 && (
                            <div className={` h-0.5 mx-2 sm:mx-3 lg:mx-4 transition-all duration-300 ${isLongFlow ? 'w-8 sm:w-12 lg:w-16' : 'w-16 lg:w-20'}
                                ${status === 'completed' ? 'bg-green-500' : 'bg-gray-600'}`} />)}
                    </div>
                );
            })}
        </div>
    );
}
 
export default DesktopStepProgress;