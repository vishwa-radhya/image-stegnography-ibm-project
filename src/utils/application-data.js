 import { TbPackageImport,TbPackageExport  } from "react-icons/tb";
import { ImageUp,ImageDown,CircleEllipsis } from "lucide-react";

 export const selectionArray=[
        {
            title:'Basic encoding',
            link:'/selection/basic-encoding',
            subTitle:'Be',
            icon:ImageUp,
            description:'Embed a simple text message into an image without encryption.',
        },
        {
            title:'Basic decoding',
            link:'/selection/basic-decoding',
            subTitle:'Bd',
            icon:ImageDown,
            description:'Retrieve plain text hidden inside an image.',
        },
        {
            title:'Encryption encoding',
            link:'/selection/encrypted-encoding',
            subTitle:'Ee',
            icon:TbPackageImport,
            description:'Encrypt a message using AES before hiding it in an image for added security.',
        },
        {
            title:'Encryption decoding',
            link:'/selection/encrypted-decoding',
            subTitle:'Ed',
            icon:TbPackageExport,
            description:'Extract and decrypt a hidden AES-encrypted message from an image.',
        },
        {
            title:'More stego options',
            link:'/selection/stegnography-options',
            subTitle:'Op',
            icon:CircleEllipsis,
            description:'Explore advanced or custom steganography tools and features.',
        },
        {
            title:'Close subnav',
            link:'/',
            subTitle:'Xx',
        },
    ]
export const selectionArraySliced = selectionArray.slice(0,5)

export const basicEncodingSteps=[
    { id: 0, title: "Upload Image", description: "Select an image file to hide your message" },{ id: 1, title: "Enter Message", description: "Type the secret message to embed" },{ id: 2, title: "Process Image", description: "Convert and prepare the image" },{ id: 3, title: "Encode Message", description: "Hide the message in the image" },{ id: 4, title: "Download Result", description: "Get your steganographic image" }
]
export const basicDecodingSteps=[
    { title: "Upload BMP Image", description: "Select a BMP file that may contain hidden message" },{ title: "Decode Message", description: "Extract the hidden message from the image" },{ title: "View Result", description: "Read the decoded secret message" }
]
export const encryptedEncodingSteps = [
    {title: "Select Image",description: "Choose an image file to hide your encrypted message"},{title: "Setup Encryption",description: "Enter your message, password, and security options"},{title: "Encrypt Message",
    description: "Your message is being encrypted with AES-256"},
    {title: "Embed Data",description: "Hiding encrypted data in the image pixels"},{title: "Secure Storage",description: "Creating security hash and storing metadata"},{title: "Complete",description: "Your encrypted steganographic image is ready"}
];
export const encryptedDecodingSteps = [
    {title: "Upload Encrypted Image", description: "Select a BMP file with encrypted steganographic data"},
    {title: "Enter Password", description: "Provide the password to decrypt the hidden message"},{title: "Decrypt & Extract", description: "Extracting and decrypting hidden message with AES-256"},{title: "View Decrypted Message", description: "Read the successfully decrypted secret message"}
];