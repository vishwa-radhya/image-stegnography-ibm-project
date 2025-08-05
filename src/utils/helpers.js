import JSZip from "jszip";
import { saveAs } from "file-saver";
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