import { Webhook } from "svix";
import userModel from "../models/userModel.js";
import transactionModel from "../models/transactionModel.js";
import base64 from "base-64"; 


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


// get user available credit
const userCredits = async (req, res) => {
  try {
    const { clerkId } = req.user;
    console.log("Fetching credits for clerkId:", clerkId);

    const userData = await userModel.findOne({ clerkId });
    if (!userData) {
      console.log("No user found for clerkId");
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("User data:", userData);
    res.json({ success: true, credits: userData.creditBalance });

  } catch (error) {
    console.log("Error in userCredits:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


const paypalPayment = async (req, res) => {
  try {
    const { clerkId, planId } = req.body;
    const userData = await userModel.findOne({ clerkId });
    if (!userData || !planId) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    let credits, plan, amount;

    switch (planId) {
      case "Basic":
        plan = "Basic";
        credits = 100;
        amount = 10;
        break;
      case "Advanced":
        plan = "Advanced";
        credits = 500;
        amount = 50;
        break;
      case "Business":
        plan = "Business";
        credits = 5000;
        amount = 250;
        break;
      default:
        return res.json({ success: false, message: "Invalid Plan" });
    }

    const date = Date.now();

    // Save transaction in DB
    const transaction = await transactionModel.create({
      clerkId,
      plan,
      amount,
      credits,
      date,
    });

    // Get PayPal access token
    const tokenRes = await axios({
      url: `${PAYPAL_API}/v1/oauth2/token`,
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + base64.encode(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRETE}`),
      },
      data: "grant_type=client_credentials",
    });

    const accessToken = tokenRes.data.access_token;
    console.log('accessToken');

    // Create PayPal order
    const orderRes = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount.toFixed(2),
            },
          },
        ],
        application_context: {
          return_url: "http://localhost:5173/buy-credit/payment/success",
          cancel_url: "http://localhost:5173/buy-credit/payment/cancel",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const approvalLink = orderRes.data.links.find(link => link.rel === "approve").href;
    
    return res.json({
      success: true,
      approvalUrl: approvalLink,
      orderId: orderRes.data.id,
    });

  } catch (error) {
    console.log("Error in paypalPayment:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};


export { clerkWebhook, userCredits, paypalPayment };
