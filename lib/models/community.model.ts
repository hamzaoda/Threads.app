import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
    id: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: String,
    bio: String,
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Thread",
        },
    ],
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
});
// the first time it's called the user schema will be created which is the second part and then the first part will be called always after
const Community = mongoose.models.Community || mongoose.model("Community", communitySchema);

export default Community