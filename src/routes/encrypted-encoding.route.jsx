import { useState } from "react";
import { encodeMessage, handleImageDataExtraction } from "../utils/image-utils";
import { encryptWithWorker,hashWithWorker } from "../utils/crypto-utils";
import { realtimeDb } from "../utils/firebase";
import { push,ref, update } from "firebase/database";
import { exportStegoBmpAsZip } from "../utils/helpers";

const EncryptedEncoding = () => {
    const [imageData,setImageData]=useState(null);
    const [requirements,setRequirements]=useState({message:'',password:''});
    const [options,setOptions]=useState({expiryDate:'',expiryCount:'0'});
 
    const imageDataSetter=(originalBytes,width,height,dataOffset)=>setImageData({originalBytes:originalBytes,width:width,height:height,dataOffset:dataOffset})
    const handleRequirementsChange=(e)=>setRequirements(prev=>({...prev,[e.target.name]:e.target.value}))
    const handleOptionschange=(e)=>setOptions(prev=>({...prev,[e.target.name]:e.target.value})) 
    const handlImageUpload=async(e)=>{
        setImageData(null)
        const file = e.target.files[0];
        if(!file) return
        const result = await handleImageDataExtraction(file);
        imageDataSetter(result.bytes,result.width,result.height,result.dataOffset)
    }
    const handleButtonClick=async()=>{
        if (!requirements.message || !imageData || !requirements.password) return;
        const { salt, iv, cipherText } = await encryptWithWorker(
        requirements.message,requirements.password);
        const uniqueId = await pushEncryptedData(salt,iv,cipherText,
        options.expiryDate,options.expiryCount);
        const stegoBytes = encodeMessage(imageData, uniqueId, 'encrypted');
        if (!stegoBytes) return;
        const {hash} = await hashWithWorker(stegoBytes);
        const docRef = ref(realtimeDb, `stegMessages/${uniqueId}`);
        await update(docRef, { stegoHash: hash });
        await exportStegoBmpAsZip(stegoBytes,'hidden_message')
        setOptions({expiryDate:'',expiryCount:'0'})
        setRequirements({message:'',password:''})
        setImageData(null)
    }
    async function pushEncryptedData(salt,iv,cipherText,expiryDate,expiryCount){
        const docRef = await push(ref(realtimeDb,'stegMessages'),{
            salt,iv,cipherText,expiryCount:expiryCount!=='0' ? expiryCount : 'none',expiryDate,createdAt:Date.now()
        })
        return docRef.key;
    }
    return ( 
        <div className="border rounded p-4 flex flex-col gap-2">
            <h2 className="text-xl font-semibold"> Enc Steganography Encode</h2>
            <input
                type="file"
                accept="image/*"
                onChange={handlImageUpload}
                className="block w-full"
            />
            <textarea
                placeholder="Enter the message to embed"
                className="w-full h-32 p-2 border rounded"
                value={requirements.message}
                onChange={handleRequirementsChange}
                maxLength={ 700}
                name="message"
            />
            <input placeholder="password" className="border rounded w-full" minLength={4} maxLength={40} onChange={handleRequirementsChange} value={requirements.password} name="password" />
            <div className="border rounded p-4 flex gap-5">
                <input type="date" className="border" name="expiryDate" onChange={handleOptionschange} value={options.expiryDate} /> 
                <input type="text" className="border" name="expiryCount" placeholder="count" maxLength={5} onChange={handleOptionschange} value={options.expiryCount} /> 
            </div>
            <button className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50" disabled={!imageData || !requirements.message || !requirements.password} onClick={handleButtonClick}>Encode</button>
        </div>
     );
}
 
export default EncryptedEncoding;