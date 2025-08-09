import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "sonner";
/**
 * @function exportStegoBmpAsZip
 * @param {*} stegoBytes 
 * @param {*} filename default='stego-image'
 * @returns none
 */
export async function exportStegoBmpAsZip(stegoBytes,filename='stego-image'){
    const zip = new JSZip();
    zip.file(`${filename}.bmp`,stegoBytes); // add bmp to zip
    const content = await zip.generateAsync({type:'blob'}) // generate zip blob
    saveAs(content,`${filename}.zip`)
}
export const getStepStatus=(stepIndex,currentStep)=>{
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'active';
    return 'pending';
}
export const getStepIcon=(stepIndex,status,isProcessing)=>{
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
}
export const handleDecodedMessageCopy=(decodedMessage)=>{
        if(decodedMessage){
            navigator.clipboard?.writeText(decodedMessage)
            toast.success('Decoded message copied to clipboard')
        }else{
            toast.error('No decoded message to copy')
        }
    }