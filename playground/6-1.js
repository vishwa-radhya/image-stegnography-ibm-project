// now heading to encryption before encoding
// using  the AES-GCM algorithm (secure + supports authentication) with a password-derived key.
/**
 *  Derive a key from a password using PBKDF2
    Generate a random salt and IV
    Use AES-GCM to encrypt the message
    Encode the output and include salt, iv, and ciphertext in the final data
 */
async function encryptMessage(message, password) {
  const enc = new TextEncoder();

  // Generate random salt and IV
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Derive key
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  // Encrypt the message
  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    enc.encode(message)
  );

  // Return everything needed to decrypt later
  return {
    salt: Array.from(salt),
    iv: Array.from(iv),
    cipherText: Array.from(new Uint8Array(encrypted))
  };
}
function outputEncryptedVals(arr){
  console.log(arr.map(e=>String.fromCharCode(e)).join(''))
}
const data=await encryptMessage('hello world is it me yet not','alt')
outputEncryptedVals(data.salt)
outputEncryptedVals(data.iv)
outputEncryptedVals(data.cipherText)
console.log(await decryptMessage(data,'alt'))

//decryption func
async function decryptMessage(encryptedData, password) {
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  // Convert arrays back to Uint8Array
  const salt = new Uint8Array(encryptedData.salt);
  const iv = new Uint8Array(encryptedData.iv);
  const cipherText = new Uint8Array(encryptedData.cipherText);

  // Derive the key again
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  try {
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      cipherText
    );

    return dec.decode(decrypted);
  } catch (e) {
    throw new Error("Decryption failed. Incorrect password or corrupted data.");
  }
}
