#  Image Steganography with Encrypted Hiding & Auto-Expiring Keys

##  Overview
This project is a **browser-based image steganography tool** that enables users to **securely hide and extract messages** within images using **Least Significant Bit (LSB)** encoding. The system ensures **confidentiality** through **AES-GCM encryption**, **data integrity verification**, and **auto-expiring decryption keys**.

Built entirely with **JavaScript and HTML5 Canvas**, it runs **fully client-side** — ensuring that no images or keys are ever sent to a server, maintaining complete user privacy.

---

##  Key Features
-  **AES-GCM Encryption** – Encrypts hidden messages before embedding into images.
-  **BMP Image Support** – Converts all uploads to 24-bit BMP format for predictable pixel manipulation.
- **Client-Side Processing** – All encoding/decoding happens in the browser, with zero server dependency.
- **Auto-Expiring Keys** – Decryption keys expire after a set duration or usage count.
- **Data Integrity Verification** – SHA-256 hashing to prevent tampering or corruption.
- **End-Marker Detection** – Accurate message retrieval without length misinterpretation.
- **Cross-Platform** – Works on any modern browser (desktop or mobile).

---

##  Tech Stack
**Frontend:**
- HTML5 Canvas API
- JavaScript (ES6+)
- Tailwind CSS (for UI)

**Cryptography:**
- Web Crypto API (AES-GCM, SHA-256)
- PBKDF2 for key derivation

**Image Processing:**
- Custom BMP parser & pixel manipulator
- LSB encoding/decoding algorithm

---

##  Architecture
[User Input]
→ [AES-GCM Encryption]
→ [BMP Conversion]
→ [LSB Embedding]
→ [Download Encoded Image]

[Encoded Image + Key]
→ [LSB Extraction]
→ [AES-GCM Decryption]
→ [Original Message Output]

## Encoding
- Upload an image (any format – auto-converted to 24-bit BMP).
- Enter your secret message.
- Set a password (used for AES-GCM encryption & key derivation).
- (Optional) Set expiry rules for the decryption key.
- Download the encoded BMP image.

## Decoding
- Upload the encoded BMP image.
- Enter the password.
- View or copy the decoded message.

## Future Enhancements
- **Progressive Web App (PWA) support** for offline usage and installation on devices.
- **Pseudo-randomized message embedding** to enhance steganographic security and resist statistical analysis.
- **Inbuilt image sharing system** for secure transmission of encoded images without third-party platforms.
- Drag-and-drop image upload for improved usability.
- Support for larger payloads through multi-image segmentation and linking.