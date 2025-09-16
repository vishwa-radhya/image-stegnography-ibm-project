const MARKERS = {
  'plain': 'x0x',
  'encryptedlsb': 'x1x',
  'encryptedlcg': 'x2x',
  'encryptedsha': 'x3x'
};

/**
 * @function encode24BitBMP // accepts any file type and converts to 24-bit bmp file
 * @param imageData //  {width,height,data} extracted  from image when drawn to canvas
 * @returns // 24-bit bmp image buffer
 */
export function convert24BitBMP(imageData) {
  const { width, height, data } = imageData;
  const rowSize = Math.floor((24 * width + 31) / 32) * 4;
  const padding = rowSize - width * 3;
  const pixelDataSize = rowSize * height;
  const fileSize = 54 + pixelDataSize;

  const buffer = new Uint8Array(fileSize);
  const dv = new DataView(buffer.buffer);
  // BMP Header6
  dv.setUint8(0, "B".charCodeAt(0));
  dv.setUint8(1, "M".charCodeAt(0));
  dv.setUint32(2, fileSize, true);
  dv.setUint32(6, 0, true);
  dv.setUint32(10, 54, true);
  // DIB Header
  dv.setUint32(14, 40, true);
  dv.setInt32(18, width, true);
  dv.setInt32(22, -height, true); // Top-down BMP
  dv.setUint16(26, 1, true);
  dv.setUint16(28, 24, true);
  dv.setUint32(30, 0, true);
  dv.setUint32(34, pixelDataSize, true);
  dv.setUint32(38, 2835, true);
  dv.setUint32(42, 2835, true);
  dv.setUint32(46, 0, true);
  dv.setUint32(50, 0, true);

  let offset = 54;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      buffer[offset++] = data[i + 2]; // B
      buffer[offset++] = data[i + 1]; // G
      buffer[offset++] = data[i];     // R
    }
    for (let p = 0; p < padding; p++) {
      buffer[offset++] = 0;
    }
  }
  return buffer;
}

/**
 * @function extractBmpMeta
 * @param bytes // finds width, height, dataOffset, bitDepth, compression from data bytes 
 * @returns // object of meta data
 */

export function extractBmpMeta(bytes) {
  const width = bytes[18] | (bytes[19] << 8) | (bytes[20] << 16) | (bytes[21] << 24);
  const height = bytes[22] | (bytes[23] << 8) | (bytes[24] << 16) | (bytes[25] << 24);
  const dataOffset = bytes[10] | (bytes[11] << 8) | (bytes[12] << 16) | (bytes[13] << 24);
  const bitDepth = bytes[28] | (bytes[29] << 8);
  const compression = bytes[30] | (bytes[31] << 8) | (bytes[32] << 16) | (bytes[33] << 24);
  return { width, height, dataOffset, bitDepth, compression };
}

/**
 * @function getImageDataFromFile
 * @param  file 
 * @returns  object of width, height and image data
 */

export const getImageDataFromFile = (file)=>{
    return new Promise((resolve,reject)=>{
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          resolve(imageData);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    })
  }
  async function deriveSeedFromPassword(password){
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256",data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return (hashArray[0] << 24) | (hashArray[1] << 16) | (hashArray[2] << 8) | hashArray[3];
  }
  function createLCG(seed){
    let state = seed >>> 0; // force unsigned 32-bit
    const a = 1664525;
    const c = 1013904223;
    const m = 2 ** 32;
    return ()=>{
      state = (a*state+c) % m;
      return state;
    }
  }
  const encodeMessageLCG = (bytes,width,height,messageBits,dataOffset,seed)=>{
    const availableBits = width*Math.abs(height)*3;
    if(messageBits.length > availableBits-24){
      return null;
    }
    const stegoBytes = new Uint8Array(bytes);
    const BYTES_PER_PIXEL = 3;
    const rowSize = width * BYTES_PER_PIXEL;
    const padding = (4-(rowSize%4)) % 4;
    const absHeight = Math.abs(height);
    const totalDataBytes = absHeight * (rowSize + padding);
    // --- step 1: sequentially write the marker (first 24 bits) ---
    for(let i=0;i<24;i++){
      const pos = dataOffset+i;
      stegoBytes[pos] = (stegoBytes[pos] & 0xFE) | messageBits[i];
    }

    // create generator seeded by password
    const rand = createLCG(seed);
    let bitIndex=24; // start after marker
    const used = new Set(); // avoid overwriting the same byte multiple times

    while(bitIndex<messageBits.length){
      let pos = rand() % totalDataBytes;
      pos += dataOffset; // skip header
      if(pos < dataOffset+24) continue; // skip reserved  marker bytes
      if(used.has(pos)) continue;
      stegoBytes[pos] = (stegoBytes[pos] & 0xFE) | messageBits[bitIndex];
      used.add(pos);
      bitIndex++;
    }
    return stegoBytes;
  }
/**
 * @function encodeMessage
 * @param  imageData 
 * @param  message 
 * @param  encodingType
 * @param  password
 * @returns stegoBytes
 */

export const encodeMessage=async(imageData,message,encodingType='plain',password='')=>{
  const {originalBytes,width,height,dataOffset}=imageData;
  const messageBits=[]
  let finalMessage=MARKERS[encodingType]+message+(encodingType==='plain' ? '\0' : '||END||');
  for (let i = 0; i < finalMessage.length; i++) {
    const charCode = finalMessage.charCodeAt(i);
    for (let b = 7; b >= 0; b--) {
      messageBits.push((charCode >> b) & 1);
    }
  }
  let stegoBytes;
  if(encodingType === 'encryptedlcg'){
    if(!password.length){
      alert('Password required');
      return null;
    }
    const seed = await deriveSeedFromPassword(password);
    stegoBytes = encodeMessageLCG(originalBytes,width,height,messageBits,dataOffset,seed);
  }else{
    stegoBytes = encodeMessageWithPadding(originalBytes,width,height,messageBits,dataOffset);
  }
  if(!stegoBytes){
    alert("Message is too long for this image.");
    return null;
  }
  return stegoBytes;
}

/**
 * @function encodeMessageWithPadding
 * @param {*} bytes 
 * @param {*} width 
 * @param {*} height 
 * @param {*} messageBits 
 * @param {*} dataOffset 
 * @returns // stegoBytes with padding to actual image data(bmp)
 */

export const encodeMessageWithPadding=(bytes,width,height,messageBits,dataOffset)=>{
  const availableBits = width * Math.abs(height)*3 // 3 bits per pixel
  if(messageBits.length > availableBits){
    alert('message is too long for this image.')
    return null
  }
  const stegoBytes = new Uint8Array(bytes);
  const BYTES_PER_PIXEL=3
  const rowSize = width * BYTES_PER_PIXEL
  const padding = (4 - (rowSize % 4)) % 4;
  const absHeight = Math.abs(height);
  const isTopDown = height < 0;
  let bitIndex = 0;
  for(let row=0;row<absHeight;row++){
    const actualRow = isTopDown ? row : absHeight-1-row;
    let rowStart = dataOffset+actualRow*(rowSize+padding);
    for (let col = 0; col < rowSize && bitIndex < messageBits.length; col++) {
        const pixelIndex = rowStart + col;
        stegoBytes[pixelIndex] = (stegoBytes[pixelIndex] & 0xFE) | messageBits[bitIndex];
        bitIndex++;
        }
  }
  return bitIndex >= messageBits.length ? stegoBytes : null;
}

/**
 * @function decodeMessage
 * @param {*} file 
 * @param {*} type
 * @param {*} password
 * @returns decodedMessage
 */
export const decodeMessage=async(file,type,password='')=>{
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const bytes = new Uint8Array(reader.result);
        const isBMP = bytes[0] === 0x42 && bytes[1] === 0x4D; // 'B', 'M'
        if (!isBMP) throw new Error("Not a valid BMP file");
        const width = bytes[18] | (bytes[19] << 8) | (bytes[20] << 16) | (bytes[21] << 24);
        const height = bytes[22] | (bytes[23] << 8) | (bytes[24] << 16) | (bytes[25] << 24);
        const dataOffset = bytes[10] | (bytes[11] << 8) | (bytes[12] << 16) | (bytes[13] << 24);
        const message = decodeMessageWithPadding(bytes, width, height, dataOffset,type,password);
        if(message==="x-*incorrect:decoder:selection*-x"){
          reject( new Error("Incompitable decoder selection error"))
        }
        resolve(message);
      } catch (error) {
        reject("Failed to decode message: " + error.message);
      }
    };
    reader.onerror = () => reject("Failed to read file.");
    reader.readAsArrayBuffer(file);
  });
}

const decodeMessageLCG=async(bytes,width,height,dataOffset,password)=>{
  const rowSize = width * 3;
  const padding = (4 - (rowSize % 4)) % 4;
  const absHeight = Math.abs(height);

  const seed = await deriveSeedFromPassword(password);
  const rng = createLCG(seed);
  const chars=[]
  const used = new Set();
  const totalDataBytes = absHeight*(rowSize+padding);
  // helper to map next LCG value to pixel index
  const getByteIndex=()=>{
    let pos;
    do{
      pos = (rng()%totalDataBytes) + dataOffset;
    }while(pos<dataOffset+24 || used.has(pos));
    used.add(pos);
    return pos;
  }
  let attempts=0;
  const MAX_ATTEMPTS = 300;
  while(true){
    let byte =0;
    for(let bit =0;bit<8;bit++){
      if(attempts++ > MAX_ATTEMPTS){
        console.error("Decoding LCG stuck, too many attempts")
        return chars.join("");
      }
      const pos = getByteIndex();
      byte = (byte << 1) | (bytes[pos] & 1);
    }
    chars.push(String.fromCharCode(byte));
    if(chars.slice(-6).join("") === "||END||"){
      break;
    }
  }
  return chars.join("")
}

/**
 * @function decodeMessageWithPadding
 * @param {*} bytes 
 * @param {*} width 
 * @param {*} height 
 * @param {*} dataOffset 
 * @param {*} type
 * @param {*} password
 * @returns decodedMessage to utility function
 */
export const decodeMessageWithPadding=async(bytes,width,height,dataOffset,type,password)=>{
  const rowSize = width * 3;
  const padding = (4 - (rowSize % 4)) % 4;
  const absHeight = Math.abs(height);
  const isTopDown = height < 0;
  let bits = [];
   // ---- Step 1: Read the first 24 bits only ----
  let checkBits = [];
  for (let row = 0; row < absHeight && checkBits.length < 24; row++) {
    const actualRow = isTopDown ? row : absHeight - 1 - row;
    const rowStart = dataOffset + actualRow * (rowSize + padding);

    for (let col = 0; col < rowSize && checkBits.length < 24; col++) {
      checkBits.push(bytes[rowStart + col] & 1);
    }
  }
  const checkBitChars = [];
  for (let i = 0; i + 8 <= checkBits.length; i += 8) {
    const byte = checkBits
      .slice(i, i + 8)
      .reduce((acc, b, j) => acc | (b << (7 - j)), 0);
    checkBitChars.push(String.fromCharCode(byte));
  }
  const marker = checkBitChars.join("");
  if((type==='plain' && marker.trim()!=='x0x') || (type==='encrypted' && marker.trim()==='x0x')){
    return "x-*incorrect:decoder:selection*-x"
  }
  if(marker.trim()==='x2x'){
    if(!password.length){
      return "x-*incorrect:decoder:selection*-x"
    }
    return await decodeMessageLCG(bytes,width,height,dataOffset,password);
  }
  for (let row = 0; row < absHeight; row++) {
    const actualRow = isTopDown ? row : absHeight - 1 - row;
    const rowStart = dataOffset + actualRow * (rowSize + padding);
    for (let col = 0; col < rowSize; col++) {
      bits.push(bytes[rowStart + col] & 1);
    }
  }
  const chars = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    const byte = bits.slice(i, i + 8).reduce((acc, b, j) => acc | (b << (7 - j)), 0);
    if (byte === 0) break;
    chars.push(String.fromCharCode(byte));
  }
  return chars.slice(3).join("");
}

/**
 * @function handleImageDataExtraction
 * @param {*} file 
 * @returns {bytes,width,height,dataOffset}
 */
export async function handleImageDataExtraction(file){
  const isBmp = file.name.toLowerCase().endsWith('.bmp');
  if(isBmp){
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer)
    const meta = extractBmpMeta(uint8Array);
    if(meta.bitDepth!==24 || meta.compression!==0){
        alert("Only 24-bit uncompressed BMP files are supported.");
        return null;
      }
      return {bytes:uint8Array,width:meta.width,height:meta.height,dataOffset:meta.dataOffset,isConverted:false}
  }else{
    const imageData = await getImageDataFromFile(file);
    const bmpBytes = convert24BitBMP(imageData);
    const meta = extractBmpMeta(bmpBytes);
    return {bytes:bmpBytes,width:meta.width,height:meta.height,dataOffset:meta.dataOffset,isConverted:true}
  }
}