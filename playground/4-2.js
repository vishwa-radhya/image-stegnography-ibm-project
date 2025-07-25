/**
 * now we can encode/decode data to 24-bit BMPs
 * the problem if the bmp is not the required bit type from BMP
 * we could have specific encoding and decoding mechanimsms for each type but here are the limitations
 * the available types were 24-bit, 32-bit, 8-bit, 1,4-bit, compressed ones
 * where 24-bit has pixel with 3 bytes for each (BGR)
 * 24-bit has RAW RGB, predictable layout 
 * 32-bit tricky - Extra alpha channel but works
 * 8-bit complex which uses color palletes
 * 1,4 bits and unusable with each byte encodes multiple pixels
 * compressed - no direct access to pixels - impossible
 * 
 * to get these correctly we can do is check for 24-bit BMP
 * if not say user to use a 24-bit one or ----
 * say them to use tools like Paint(windows)/paint.net which has save as 24-bit BMP option
 * or else use photoshop/GIMP for manual export options
 * or online convertors
 * HAS an other option its like accepting image from any format into html <canvas></canvas> then draw the image and export as 24-bit BMP (using JS BMP encoder lib) from npm (bmp-js)
 * ALSO add some downloadable 24-bit BMP images in site
 * 
 */

// function to check if BMP is 24-bit
function is24BitBMP(arrayBuffer) {
  const dataView = new DataView(arrayBuffer);

  // Check the BMP signature (first 2 bytes should be 'BM' = 0x42 0x4D)
  const signature = String.fromCharCode(dataView.getUint8(0)) + String.fromCharCode(dataView.getUint8(1));
  if (signature !== 'BM') {
    console.warn('Not a valid BMP file.');
    return false;
  }

  // Get the bits per pixel value from offset 28 (14 bytes header + 40 bytes DIB = offset 28)
  const bitsPerPixel = dataView.getUint16(28, true); // true = little-endian

  console.log(`Bits per pixel: ${bitsPerPixel}`);
  return bitsPerPixel === 24;
}

//offset 0-1 length 2bytes description - signature - should be "BM"
//offset 28 length 2bytes description - bits per pixel(target:24)
//little endian BMP stores integers in little-endian format, so getUint16(...,true) is needed

//usage example 
const fileInput = document.getElementById("bmpFileInput");
fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  const arrayBuffer = await file.arrayBuffer();

  if (is24BitBMP(arrayBuffer)) {
    console.log(" This is a 24-bit BMP image.");
  } else {
    console.error(" Not a 24-bit BMP. Please upload a valid one.");
  }
});
