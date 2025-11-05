import User from "../models/user.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    //Create a Svix Webhook instance with clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    //Getting Headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    //Verifying Headers
    await whook.verify(JSON.stringify(req.body), headers);

    //Getting Data from req body
    const { type, data } = req.body;

    const userData = {
      _id: data.id,
      username: data.first_name + " " + data.last_name,
      email: data.email_addresses[0].email_address,
      image: data.profile_image_url,
    }

    //Switch case for different events
    switch (type) {
      case "user.created":{
        await User.create(userData);
        break;
      }

       case "user.updated":{
        await User.findByIdAndUpdate(data.id, userData);
        break;
      }
      case "user.deleted":{
        await User.findByIdAndDelete(data.id);
        break;
      }
         default:
        break;
    }
    res.json({success: true, message: "Webhook received successfully"});
  } catch (error){
    console.error("Error processing webhook:", error);
    res.json({ success: false, message: "Webhook Error: " + error.message });
  }
}

export default clerkWebhooks