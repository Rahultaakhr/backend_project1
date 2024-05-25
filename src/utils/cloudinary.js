import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: 'rahultaakhr',
    api_key: '633449946396263',
    api_secret: 'YcYIxsjsf5EUJZHq1H1rwXW3aoI'
});

const uplaodCloudinary = async (localFilePath) => {
    if (!localFilePath) return null

    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log(" file is uploaded on cloudinary successfully ", response);
        return response
    } catch (error) {

        fs.unlinkSync(localFilePath)
        return null
    }

}
export {uplaodCloudinary}