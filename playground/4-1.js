/**
 * the present bmp image encoder decoder has some limitations 
 * the issues were 
 * 1. ROW PADDING
 * each row in BMP should be multiple of 4bytes
 * if(width*3)%4 != 0 BMP adds extra bytes (padding) at end of each row
 * if we dont skip those decoder will read garbage values
 * 
 * solution:
 * modifying encoder/decoder to skip row padding when embedding or extracting LSBs
 * this way it'll support all valid 24-bit BMPs regardless of width
 * with thse
 * each row of pixels (BGR triplets) must be padded so that its total byte length is a multiple of 4
 * rowSize = width*3
 * padding = (4-(rowSize%4))%4
 * so while encoding : only write to pixel bytes, skipping padding bytes
 * during decoding only read LSBs from pixel bytes, ignore padding
 * 
 */

// updated encoding function
function encodeMessageWithPadding(bytes, width, height, messageBits, dataOffset) {
  const stegoBytes = new Uint8Array(bytes); 
  const rowSize = width * 3;
  const padding = (4 - (rowSize % 4)) % 4;
  let bitIndex = 0;

  console.log("Encoding with width =", width, "height =", height, "padding =", padding);

  let bytePos = dataOffset;
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width * 3; col++) { 
      if (bitIndex >= messageBits.length) break;

      stegoBytes[bytePos] = (stegoBytes[bytePos] & 0xFE) | messageBits[bitIndex];
      bitIndex++;
      bytePos++;
    }
    bytePos += padding; 
  }

  console.log("Total bits written:", bitIndex);
  return bitIndex >= messageBits.length ? stegoBytes : null;
}
 //the decoding function
 function decodeMessageWithPadding(bytes, width, height, dataOffset) {
  const rowSize = width * 3;
  const padding = (4 - (rowSize % 4)) % 4;
  let bits = [];

  console.log("Decoding with width =", width, "height =", height, "padding =", padding);

  let bytePos = dataOffset;
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width * 3; col++) {
      bits.push(bytes[bytePos] & 1);
      bytePos++;
    }
    bytePos += padding;
  }

  let chars = [];
  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.slice(i, i + 8).reduce((acc, b, j) => acc | (b << (7 - j)), 0);
    if (byte === 0) break;
    chars.push(String.fromCharCode(byte));
  }

  const message = chars.join("");
  console.log("Decoded Message:", message);
  return message;
}
