import { getStepIcon,getStepStatus } from "../utils/helpers";
const MobileStepProgress = ({steps,currentStep,isProcessing}) => {
    return ( 
        <div className="sm:hidden flex justify-center mb-4">
        <div className="flex items-center space-x-3">
            {steps.map((_, index) => {
            const status = getStepStatus(index,currentStep);
            return (
                <div key={`mobile-step-${index}`} className={`
                w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300 text-xs
                ${status === 'completed' ? 'bg-green-500 border-green-500' : 
                    status === 'active' ? 'bg-blue-600 border-blue-500' : 
                    'bg-gray-700 border-gray-600'}
                `}>
                {getStepIcon(index, status,isProcessing)}
                </div>
            );
            })}
        </div>
        </div>
     );
}
 
export default MobileStepProgress;