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