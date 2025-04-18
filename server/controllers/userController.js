
// API controller function manage claerk user with database 
// https://localhost:5000/api/user/webhook

const clerkWebhook = async (req, res) => {
    const { body } = req;
    console.log("Webhook received:", body);

    // Handle the webhook event here
    // For example, you can save the user data to your database

    // Respond with a 200 status code to acknowledge receipt of the webhook
    res.status(200).send('Webhook received');
}