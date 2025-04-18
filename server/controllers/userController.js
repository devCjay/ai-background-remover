import { Webhook } from "svix"
import userModel from "../models/userModel.js";
// API controller function manage claerk user with database 
// https://localhost:5000/api/user/webhook

const clerkWebhook = async (req, res) => {
    
    try {

        const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await webhook.verify(JSON.stringify(req.body),{
        "svix-id": req.headers['svix-id'],
        "svix-signature": req.headers['svix-signature'],    
        "svix-timestamp": req.headers['svix-timestamp'] 
    });
        
    const {data, type} = req.body;

    switch (type) {
        case 'user.created':{
             // Handle user creation
             const userData = {
                clerkId: data.id,
                email: data.email_addresses[0].email_address,
                firstName: data.first_name,
                lastName: data.last_name,
                photo: data.profile_image_url,  
            }
            await userModel.create(userData);
            res.json({success: true, message: "User created successfully"});
            break;
        }
           
        case 'user.updated': {
             // Handle user update
            const userData = {
                email: data.email_addresses[0].email_address,
                firstName: data.first_name,
                lastName: data.last_name,
                photo: data.profile_image_url,
            }
            await userModel.findOneAndUpdate({ clerkId: data.id }, userData, { new: true }); 
            res.json({success: true, message: "User updated successfully"});  
            break;
        }   
           
        case 'user.deleted':
            // Handle user deletion
           await userModel.findOneAndDelete({ clerkId: data.id });
           res.json({success: true, message: "User deleted successfully"});
           break;  

        default:
            console.log("Unknown event type:", type);
            break;
    }
    res.status(200).json({success: true, message: "Webhook verified successfully"});


        
    } catch (error) {
        console.error("Error verifying webhook:", error);
       res.json({success: false, error: error.message})
        
    }
}


export { clerkWebhook };