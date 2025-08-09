const StegnographyWizardHeader = ({heading,subHeading}) => {
    return ( 
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 text-center">{heading}</h2>
          <p className="text-gray-400 text-xs sm:text-sm text-center pt-2 sm:pt-3 max-w-[90%] mx-auto">
              {subHeading}
          </p>
        </div>
     );
}
export default StegnographyWizardHeader;