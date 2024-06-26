import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    displayName: mongoose.SchemaTypes.String,
    password: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
});

export const User = mongoose.model("User", userSchema);