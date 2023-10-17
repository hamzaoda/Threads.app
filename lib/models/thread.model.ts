import mongoose from "mongoose";

const ThreadSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    community:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Community',
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    ParentId:{
        type: String,
    },
    children : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Thread',
        }
    ]
});
// the first time it's called the user schema will be created which is the second part and then the first part will be called always after
const Thread = mongoose.models.Thread || mongoose.model("Thread", ThreadSchema);

export default Thread;
