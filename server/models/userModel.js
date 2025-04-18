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
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true, 
    },
    creditBalance: {
        type: Number,
        default: 5,
    }
}, {    timestamps: true  // Automatically add createdAt and updatedAt fields  

});

const userModel =  mongoose.models.user || mongoose.model("User", userSchema);

export default userModel;
