import mongoose from "mongoose";

const discordUserSchema = new mongoose.Schema({
    username: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    discordId: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
});

export const DiscordUser = mongoose.model("DiscordUser", discordUserSchema);