import { Webhook } from "svix";
import userModel from "../models/userModel.js";

const clerkWebhook = async (req, res) => {
  try {
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // ✅ Verify using raw buffer
    const payload = req.body; // this is a buffer
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-signature": req.headers["svix-signature"],
      "svix-timestamp": req.headers["svix-timestamp"],
    };

    const event = webhook.verify(payload, headers);
    const { data, type } = event;

    switch (type) {
      case "user.created": {
        const userData = {
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.profile_image_url,
        };
        await userModel.create(userData);
        return res.json({ success: true, message: "User created successfully" });
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.profile_image_url,
        };
        await userModel.findOneAndUpdate({ clerkId: data.id }, userData, { new: true });
        return res.json({ success: true, message: "User updated successfully" });
      }

      case "user.deleted": {
        await userModel.findOneAndDelete({ clerkId: data.id });
        return res.json({ success: true, message: "User deleted successfully" });
      }

      default:
        console.log("Unhandled Clerk event:", type);
        break;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Webhook verification failed:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};

export { clerkWebhook };
