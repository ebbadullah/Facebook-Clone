import { v2 as cloudinary } from "cloudinary"; 
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,  
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})

import fs from 'fs';

export const uploadToCloudinary = async (filePath, folder) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type: "auto",
        });
        
        // Clean up temporary file after upload
        try {
            fs.unlinkSync(filePath);
        } catch (unlinkError) {
            console.error("Error deleting temporary file:", unlinkError);
        }
        
        return result;
    } catch (error) {
        console.error("Error uploading to cloudinary:", error);
        
        // Clean up temporary file even if upload fails
        try {
            fs.unlinkSync(filePath);
        } catch (unlinkError) {
            console.error("Error deleting temporary file:", unlinkError);
        }
        
        return null;
    }
};

export default cloudinary;
