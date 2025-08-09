import { useState } from "react";
import {encodeMessage,handleImageDataExtraction } from "../utils/image-utils";
import { exportStegoBmpAsZip } from "../utils/helpers";
import { basicEncodingSteps } from "../utils/application-data";
import { toast } from "sonner";
import {Button} from '../components/ui/button'
import StegnographyWizardHeader from "../components/stegnography-wizard-header.component";
import DesktopStepProgress from "../components/desktop-step-progress.coponent";
import MobileStepProgress from "../components/mobile-step-progress.component";
import CurrentStepInfo from "../components/current-step-info.component";
import EncodingStep0 from "../components/encoding-step-0.component";
import EncodingStep2 from "../components/encoding-step-2.component";
import EncodingStep3 from "../components/encoding-step-3.component";
import EncodingStep4 from "../components/encoding-step-4.component";

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
        setImageData({originalBytes:result.bytes,width:result.width,height:result.height,dataOffset:result.dataOffset});
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
        <StegnographyWizardHeader heading={'Basic Steganography Wizard'} subHeading={'Follow the steps to hide your secret message within an image'} />
        <div className="mb-8 sm:mb-8">
          <DesktopStepProgress  steps={basicEncodingSteps} currentStep={currentStep} isProcessing={isProcessing} />
          <MobileStepProgress steps={basicEncodingSteps} currentStep={currentStep} isProcessing={isProcessing} />
          <CurrentStepInfo steps={basicEncodingSteps} currentStep={currentStep} />
          <div className="space-y-4 sm:space-y-6">
              {currentStep === 0 && <EncodingStep0 handleImageUpload={handleImageUpload} isProcessing={isProcessing} />}
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
              {currentStep==2 && <EncodingStep2 imageData={imageData} isProcessing={isProcessing} /> }
              {currentStep === 3 && <EncodingStep3 isProcessing={isProcessing} /> }
            {currentStep === 4 && <EncodingStep4 isProcessing={isProcessing} resetWizard={resetWizard} /> }
          </div>
        </div>
      </div>
     );
}
export default BasicEncoding;