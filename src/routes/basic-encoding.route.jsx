import { useState } from "react";
import {encodeMessage,handleImageDataExtraction } from "../utils/image-utils";
import { exportStegoBmpAsZip } from "../utils/helpers";
import { basicEncodingSteps } from "../utils/application-data";
import { toast } from "sonner";
import {Button} from '../components/ui/button'

const BasicEncoding = () => {
    const [imageData,setImageData]=useState(null);
    const [message,setMessage]=useState('');
    const [currentStep,setCurrentStep]=useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const handleImageUpload=async(e)=>{
      const file = e.target.files[0];
      if(!file) return
      setUploadedFile(file)
      setIsProcessing(true)
      try{
        const result = await handleImageDataExtraction(file);
        setImageData(result);
        setCurrentStep(1);
      }catch(err){
        console.error('Error processing image:',err);
        toast.error('error extracting image data')
      }
      setIsProcessing(false);
    }
    const handleMessageSubmit = () => {
        if (!message.trim()){
          toast.info('Please enter the message to hide')
          return
        }
        setCurrentStep(2);
        processImage();
    };
    const processImage=()=>{
      if(!imageData){
        toast.error('No image data found please start the process from beginning')
        return
      }
      setIsProcessing(true)
      if(imageData.isConverted){
          toast.info('The image is converted to 24-bit bmp type')
      }else{
        toast.info('No image conversion done')
      }
      setCurrentStep(3)
      setTimeout(()=>encodeAndFinalize(),500);
      setIsProcessing(false)
    }
    const encodeAndFinalize=async()=>{
      if(!imageData || !message){
        toast.error('No image data (or) message found please start the process from beginning')
        return
      }
        setIsProcessing(true);
        try{
          const stegoBytes = encodeMessage(imageData,message);
          setCurrentStep(4);
          setTimeout(async()=>{
            await exportStegoBmpAsZip(stegoBytes,'hidden_message');
            setIsProcessing(false);
          },1000);
        }catch(e){
          console.error('Error encoding message:',e);
          setIsProcessing(false);
          toast.error('Error encoding message')
        }
    }
    const getStepStatus = (stepIndex) => {
        if (stepIndex < currentStep) return 'completed';
        if (stepIndex === currentStep) return 'active';
        return 'pending';
    };
    const getStepIcon = (stepIndex, status) => {
      if (status === 'completed') {
          return (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" className="text-white" />
              </svg>
          );
      }
      if (status === 'active' && isProcessing) {
          return <div className="animate-spin rounded-full h-4 w-4 sm:h-4 sm:w-4 border-b-2 border-blue-400"></div>;
      }
      return <span className="text-xs sm:text-sm font-medium">{stepIndex + 1}</span>;
    };
    const resetWizard = () => {
        setCurrentStep(0);
        setImageData(null);
        setMessage('');
        setUploadedFile(null);
    };
    
    return ( 
      <div className="flex flex-col mt-1 gap-6 sm:gap-8 lg:gap-10 rounded-lg p-4 sm:p-6 shadow-2xl border border-gray-600/30 ml-[10px] mr-[10px]"
  style={{
    backgroundImage:
      "linear-gradient(to bottom right, #2b2b2b, #060501, #2b2b2b)",
  }}>
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 text-center">Basic Steganography Wizard</h2>
          <p className="text-gray-400 text-xs sm:text-sm text-center pt-2 sm:pt-3 max-w-[90%] mx-auto">
              Follow the steps to hide your secret message within an image
          </p>
        </div>
        <div className="mb-8 sm:mb-8">
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-4">
            {
              basicEncodingSteps.map((step,index)=>{
                const status = getStepStatus(index);
                return(
                  <div key={`step-ph-${index}`} className="flex items-center max-sm:gap-1">
                    <div className={`
                  flex items-center justify-center w-9 h-9 sm:w-[42px] sm:h-10 rounded-full border-2 transition-all duration-300 text-xs sm:text-sm
                  ${
                    status === "completed"
                      ? "bg-green-500 border-green-500"
                      : status === "active"
                      ? "bg-blue-600 border-blue-500"
                      : "bg-gray-700 border-gray-600"
                  }
              `}>
                        {getStepIcon(index, status)}
                    </div>
                    {index < basicEncodingSteps.length - 1 && (
                        <div className={`w-8 sm:w-13 h-0.5 mx-1 sm:mx-2 transition-all duration-300 ${status === "completed"
                        ? "bg-green-500"
                        : "bg-gray-600" }`} />
                    )}
                  </div>
                )
              })}
          </div>
          <div className="text-center flex flex-col gap-1.5 sm:gap-2.5 pt-2 sm:pt-3.5 pb-3 sm:pb-5">
              <h3 className="text-base sm:text-lg">
                {basicEncodingSteps[currentStep]?.title}
              </h3>
              <p className="text-sm sm:text-base max-w-[90%] mx-auto">
                {basicEncodingSteps[currentStep]?.description}
              </p>
          </div>
          {/*Steps */}
          <div className="space-y-4 sm:space-y-6">
              {currentStep === 0 && (
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
              )}
              {currentStep==1 && (
                <div className="space-y-4">
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
                  <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                          Secret Message
                      </label>
                      <textarea
                          placeholder="Enter your secret message here..."
                          className="w-full h-32 p-4 bg-gray-800/50 border border-gray-600 rounded-lg
                                    text-gray-100 placeholder-gray-500 resize-none
                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          maxLength={700}
                      />
                      <p className="text-xs text-gray-500">{message.length}/700 characters</p>
                  </div>
                <Button onClick={handleMessageSubmit} variant={'secondary'}
                    disabled={!message.trim()}
                    className="w-full text-[16px]">Continue to Processing</Button>
                </div>
              )}
              {(currentStep==2 && (
                <div className="space-y-4">
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 sm:p-6">
                    <div className="text-center">
                        {imageData?.isConverted ? (
                            <div className="space-y-4">
                                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mx-auto animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <div>
                                    <p className="text-gray-300 font-medium mb-2 text-sm sm:text-base">Converting to BMP format</p>
                                    <p className="text-gray-500 text-xs sm:text-sm">
                                        Your image is being converted to BMP format for steganography compatibility.
                                    </p>
                                </div>
                                {isProcessing && (
                                    <div className="flex items-center justify-center gap-2 text-blue-400 text-xs sm:text-sm">
                                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-400"></div>
                                        Converting...
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                    <p className="text-gray-300 font-medium mb-2 text-sm sm:text-base">Image Ready</p>
                                    <p className="text-gray-500 text-xs sm:text-sm">
                                        Your BMP image is ready for steganography processing.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
              ))}
              {currentStep === 3 && (
            <div className="space-y-4">
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 sm:p-6">
                <div className="text-center space-y-4">
                  <svg
                    className="w-10 h-10 sm:w-12 sm:h-12 text-[rgb(140,140,140)] mx-auto animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <p className="text-gray-300 font-medium mb-2 text-sm sm:text-base">
                    Encoding Secret Message
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Using LSB (Least Significant Bit) steganography to hide your
                    message in the image pixels.
                  </p>
                  {isProcessing && (
                    <div className="flex items-center justify-center gap-2 text-purple-400 text-xs sm:text-sm">
                      <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-purple-400"></div>
                      Encoding in progress...
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
            {currentStep === 4 && (
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
          )}
          </div>
        </div>
      </div>
     );
}
 
export default BasicEncoding;