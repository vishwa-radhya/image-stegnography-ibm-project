import { useState } from "react";
import { decodeMessage, handleImageDataExtraction } from "../utils/image-utils";
import { realtimeDb } from "../utils/firebase";
import { get,ref } from "firebase/database";
import { decryptWithWorker, hashWithWorker } from "../utils/crypto-utils";
const EncryptedDecoding = () => {
    const [file,setFile]=useState(null);
    const [decodedMessage,setDecodedMessage]=useState('');
    const [password,setPassword]=useState('');
    const handleSetPassword=(e)=>setPassword(e.target.value)
    const handleImageUpload=(e)=>{
        setFile(null)
        setDecodedMessage('')
        const file = e.target.files[0];
        if(!file) return
        const isBmp = file.name.toLowerCase().endsWith('.bmp');
        if(!isBmp) return
        setFile(file);
    }
    const handleButtonClick=async()=>{
        if(!file || !password) return
        try{
            const message = await decodeMessage(file);
            const endMarker = '||END||';
            const endIndex = message.indexOf(endMarker);
            if(endIndex !== -1){
                const validMessage = message.slice(0, endIndex + endMarker.length);
                const docId = validMessage.slice(0, endIndex);
                const dbRef = ref(realtimeDb,`stegMessages/${docId}`);
                const snapshot = await get(dbRef)
                if(snapshot.exists()){
                    const dbData = snapshot.val()
                    await handleEncryptedDecode(dbData)
                }
            }else {
                alert("END marker not found. Image might be corrupted or not a valid stego image.");
                return
            }
        }catch(e){
            console.error(e);
            alert('failed to decode message. Make sure its a valid uncompressed 24-bit bmp file ')
        }
    }
    const handleEncryptedDecode=async(dbData)=>{
        if(!dbData || !file) return
        const {salt,iv,cipherText,expiryCount,expiryDate,createdAt,stegoHash}=dbData;
        const {bytes} = await handleImageDataExtraction(file);
        const {hash}=await hashWithWorker(bytes)
        if(hash !== stegoHash){
            alert('image is tampered cant perform')
            return
        }
        try{
            const plainText  = await decryptWithWorker(cipherText,salt,iv,password);
            setDecodedMessage(plainText)
        }catch(e){
            console.error(e)
        }
    }
    return ( 
        <div>
        <h2 className="text-xl font-semibold">Encrypted Steganography Decode</h2> 
        <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="block w-full"
        /> 
        <input className="border rounded" value={password} placeholder="password"  onChange={handleSetPassword} minLength={4} maxLength={40} />
        <textarea readOnly placeholder="decoded message appears here" value={decodedMessage} className="w-full h-30 overflow-auto border rounded p-2" />
        <button className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50 cursor-pointer" disabled={!file} onClick={handleButtonClick}>Decode</button>
        </div>
     );
}
 
export default EncryptedDecoding;