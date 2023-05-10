import { v2 as cloudinary } from "cloudinary";


// Configuration 
cloudinary.config({
    cloud_name: "dlqcpn03i",
    api_key: "322526916715338",
    api_secret: "Irx0bGO3Poksxnngy5Ru09czwR4"
});


export default cloudinary;

// Generate
// const url = cloudinary.url("olympic_flag", {
//     width: 100,
//     height: 150,
//     Crop: 'fill'
// });



// The output url
// console.log(url);
// https://res.cloudinary.com/<cloud_name>/image/upload/h_150,w_100/olympic_flag