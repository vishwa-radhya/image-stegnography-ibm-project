import { useState } from "react";
import {encodeMessage,handleImageDataExtraction } from "../utils/image-utils";
import { exportStegoBmpAsZip } from "../utils/helpers";

const BasicEncoding = () => {
    const [imageData,setImageData]=useState(null);
    const [message,setMessage]=useState('');

    const imageDataSetter=(originalBytes,width,height,dataOffset)=>setImageData({originalBytes:originalBytes,width:width,height:height,dataOffset:dataOffset})
    const handleMessageChange=(e)=>setMessage(e.target.value)
    const handlImageUpload =async(e)=>{
      setImageData(null)
      const file = e.target.files[0];
      if(!file) return
      const result = await handleImageDataExtraction(file);
      imageDataSetter(result.bytes,result.width,result.height,result.dataOffset)
    }
    const handleButtonClick=async()=>{
      if(!message || !imageData) return
      const stegoBytes = encodeMessage(imageData,message);
      if(!stegoBytes) return
      await exportStegoBmpAsZip(stegoBytes,'hidden_message')
      setMessage('')
      setImageData(null)
    }
    
    return ( 
        <div className="border rounded p-4">
            <h2 className="text-xl font-semibold"> Plain Steganography Encode</h2>
             <input
                type="file"
                accept="image/*"
                onChange={handlImageUpload}
                className="block w-full"
            />
      <textarea
        placeholder="Enter the message to embed"
        className="w-full h-32 p-2 border rounded"
        value={message}
        onChange={handleMessageChange}
        maxLength={ 700}
      />
      <button
        className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        disabled={!imageData || !message}
        onClick={handleButtonClick}
      >
        Continue
      </button>
        </div>
     );
}
 
export default BasicEncoding;