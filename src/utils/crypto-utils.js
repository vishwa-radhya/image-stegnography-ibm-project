/**
 * @function encryptWithWorker
 * @param {*} message 
 * @param {*} password 
 * @returns {salt,iv,cipherText}
 */
export function encryptWithWorker(message, password) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../workers/crypto.worker.js', import.meta.url));
    const requestId = Date.now() + Math.random();
    worker.onmessage = (e) => {
      if (e.data.requestId === requestId) {
        resolve({salt: e.data.salt,iv: e.data.iv,cipherText: e.data.cipherText});
        worker.terminate(); 
      }
    };
    worker.onerror = (err) => {
      reject(err);
      worker.terminate();
    };
    worker.postMessage({ type: "encrypt", message, password, requestId });
  });
}
/**
 * @function decryptWithWorker
 * @param {*} cipherText 
 * @param {*} salt 
 * @param {*} iv 
 * @param {*} password 
 * @returns plainText
 */
export function decryptWithWorker(cipherText, salt, iv, password) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../workers/crypto.worker.js', import.meta.url));
    const requestId = Date.now() + Math.random();
    worker.onmessage = (e) => {
      if (e.data.requestId === requestId) {
        resolve(e.data.plainText);
        worker.terminate();
      }
    };
    worker.onerror = (err) => {
      reject(err);
      worker.terminate();
    };
    worker.postMessage({
      type: "decrypt",cipherText,salt,iv,password,requestId});
  });
}

/**
 * @function hashWithWorker
 * @param {*} pixelData 
 * @returns {hash}
 */
export function hashWithWorker(pixelData){
    return new Promise((resolve,reject)=>{
        const worker = new Worker(new URL('../workers/crypto.worker.js', import.meta.url));
        const requestId = Date.now() + Math.random();
        worker.onmessage = (e) => {
      if (e.data.type === 'hashResult' && e.data.requestId === requestId) {
        resolve({ hash: e.data.hash });
        worker.terminate();
      }
    };
    worker.onerror = (err) => {
      reject(err);
      worker.terminate();
    };
    worker.postMessage({ type: "hash", pixelData, requestId });
    })
}