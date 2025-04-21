import axios from 'axios'
import fs from 'fs'
import FormData from 'form-data'
import userModel from '../models/userModel.js'


// Controller function to remove Bg Image 

const removeBgImage = async (req, res) => {

    try {

        const { clerkId } = req.user;
        const user = await userModel.findOne({ clerkId });

        if (!user) {
            console.log("No user found");
            return res.json({ success: false, message: "User not found" });
        }

        if (user.creditBalance === 0) {
            return res.json({ success: false, message: 'No credit balance', creditBalance: user.creditBalance });
        }

        const imagepath = req.file.path;
        const imageFile = fs.createReadStream(imagepath);
        const formData = new FormData();
        formData.append('image_file', imageFile);

        const { data } = await axios.post('https://clipdrop-api.co/remove-background/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API,
            },
            responseType: 'arraybuffer'
        });

        const base64Image = Buffer.from(data, 'binary').toString('base64')
        const imageResult = `data:${req.file.mimetype};base64,${base64Image}`

        await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 })
        res.json({ success:true, imageResult, creditBalance: user.creditBalance-1, message:'Background Removed' });
        

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });

    }

}

export { removeBgImage }