import { getStepStatus,getStepIcon } from "../utils/helpers";
const DesktopStepProgress = ({steps,currentStep,isProcessing}) =>{
    return ( 
        <div className="hidden sm:flex items-center justify-center mb-4 space-x-8">
        {steps.map((step, index) => {
            const status = getStepStatus(index,currentStep);
            return (
            <div key={`step-ph-${index}`} className="flex items-center">
                <div className={`
                flex items-center justify-center w-9 h-9 sm:w-[42px] sm:h-10 rounded-full border-2 transition-all duration-300 text-xs sm:text-sm
                ${status === 'completed' ? 'bg-green-500 border-green-500' : 
                    status === 'active' ? 'bg-blue-600 border-blue-500' : 
                    'bg-gray-700 border-gray-600'}
                `}>
                {getStepIcon(index, status,isProcessing)}
                </div>
                {index < steps.length - 1 && (
                <div className={`
                    w-16 lg:w-20 h-0.5 mx-4 transition-all duration-300
                    ${status === 'completed' ? 'bg-green-500' : 'bg-gray-600'}
                `} />
                )}
            </div>
            );
        })}
        </div>
     );
}
 
export default DesktopStepProgress;