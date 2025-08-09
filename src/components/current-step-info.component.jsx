const CurrentStepInfo = ({steps,currentStep}) => {
    return ( 
        <div className="text-center flex flex-col gap-2 sm:gap-2.5 pt-2 sm:pt-3.5 pb-3 sm:pb-5 px-2">
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white">
                {steps[currentStep]?.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-400">
                {steps[currentStep]?.description}
            </p>
        </div>
     );
}
export default CurrentStepInfo;