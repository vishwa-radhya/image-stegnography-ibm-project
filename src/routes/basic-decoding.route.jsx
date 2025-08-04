import { useState } from "react";
import { decodeMessage } from "../utils/image-utils";

const BasicDecoding = () => {
    const [file,setFile]=useState(null);
    const [decodedMessage,setDecodedMessage]=useState('');

    const handleImageUpload=async(e)=>{
        setFile(null)
        setDecodedMessage('')
        const file = e.target.files[0];
        if(!file) return
        const isBmp = file.name.toLowerCase().endsWith('.bmp');
        if(!isBmp) return
        setFile(file);
    }
    const handleButtonClick=async()=>{
        if(!file) return
        try{
            const message = await decodeMessage(file);
            setDecodedMessage(message || "(No message found)")
        }catch(e){
            console.error(e);
            alert('failed to decode message. Make sure its a valid uncompressed 24-bit bmp file ')
        }
    }

    return ( 
        <div className="border rounded p-4">
                <h2 className="text-xl font-semibold">Plain Steganography Decode</h2> 
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full"
                 />
                 <textarea readOnly placeholder="decoded message appears here" value={decodedMessage} className="w-full h-30 overflow-auto border rounded p-2" />
                 <button className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50 cursor-pointer" disabled={!file} onClick={handleButtonClick}>Decode</button>
        </div>
     );
}
 
export default BasicDecoding;