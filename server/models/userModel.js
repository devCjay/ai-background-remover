import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    photo: {
        type: String,
        required: true, 
    },
    creditBalance: {
        type: Number,
        default: 5,
    }

});

const userModel =  mongoose.models.user || mongoose.model("User", userSchema);

export default userModel;
