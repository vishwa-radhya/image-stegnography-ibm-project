self.onmessage = async (e) => {
  const { type, message, password, pixelData, cipherText, salt, iv, requestId } = e.data;
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  if (type === "encrypt") {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const keyMaterial = await crypto.subtle.importKey(
      "raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]
    );
    const key = await crypto.subtle.deriveKey({
        name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      enc.encode(message)
    );
    self.postMessage({
      requestId,
      salt: btoa(String.fromCharCode(...salt)),
      iv: btoa(String.fromCharCode(...iv)),
      cipherText: btoa(String.fromCharCode(...new Uint8Array(encrypted)))
    });
  }
  if(type==='decrypt'){
    try{
      const saltBytes = Uint8Array.from(atob(salt),c=>c.charCodeAt(0))
      const ivBytes = Uint8Array.from(atob(iv), c => c.charCodeAt(0))
      const cipherBytes = Uint8Array.from(atob(cipherText), c => c.charCodeAt(0))
      const keyMaterial = await crypto.subtle.importKey(
        'raw',enc.encode(password),'PBKDF2',false,['deriveKey']
      )
      const key = await crypto.subtle.deriveKey({
        name:'PBKDF2',salt:saltBytes,iterations:100000,hash:'SHA-256'
      },keyMaterial,{name:'AES-GCM',length:256},false,['decrypt']
    );
    const decrypted = await crypto.subtle.decrypt(
      {name:'AES-GCM',iv:ivBytes},key,cipherBytes
    );
    self.postMessage({
      requestId,plainText:dec.decode(decrypted)
    });
    }catch(e){
      self.postMessage({
        requestId,
        error:'error decrypting message (wrong password)'
      })
    }
  }
  if(type == 'hash'){
    const hashBuffer = await crypto.subtle.digest('sha-256',pixelData);
    const hash = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
    postMessage({type:'hashResult',hash,requestId})
  }
};