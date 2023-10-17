"use server";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDb } from "../mongoose";

interface Params {
    text: string;
    author: string | any;
    communityId: string | null;
    path: string;
}

export async function createThread({
    text,
    author,
    communityId,
    path,
}: Params) {
    try {
        connectToDb();
        const createdThread = await Thread.create({
            text,
            author,
            community: null,
        });
        //update user model
        console.log("this is the author", author);
        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id },
        });
        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error creating thread : ${error.message}`);
    }
}
// this is my function
// export async function fetchPosts(author:string) {
//     console.log('this is the author', author);
//     try {
//         connectToDb();
//         const posts = await Thread.find({author});
//         console.log('this si the author', author);
//         //update user model
//         console.log('this is the author',posts);
//         return posts
//     } catch (error: any) {
//         throw new Error(`Error creating thread : ${error.message}`);
//     }
// }
export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    connectToDb();
    //we need to find the number of posts to skip for the pagination
    const skipAmount = (pageNumber - 1) * pageSize;

    //we want to fetch the threads that have no parents
    const postQuery = Thread.find({
        parentId: { $in: [null, undefined] },
    })
        .sort({ createdAt: "desc" })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({ path: "author", model: User })
        .populate({
            path: "children",
            populate: {
                path: "author",
                model: User,
                select: "_id name parentId image",
            },
        });
    const totalPostsCount = await Thread.countDocuments({
        parentId: { $in: [null, undefined] },
    });
    //we are using the exec() to execute the chain of commands
    const posts = await postQuery.exec();
    const isNext = totalPostsCount > skipAmount + posts.length;
    return { posts, isNext };
}
export async function fetchThreadById(id: string) {
    connectToDb();
    try {
        const thread = await Thread.findById(id)
            .populate({
                path: "author",
                model: User,
                select: "_id id name image",
            })
            .populate({
                path: "children",
                populate: [
                    {
                        path: "author",
                        model: User,
                        select: "_id id name parentId image",
                    },
                    {
                        path: "children",
                        model: Thread,
                        populate: {
                            path: "author",
                            model: User,
                            select: "_id id name parentId image",
                        },
                    },
                ],
            })
            .exec();
        return thread;
    } catch (error: any) {
        throw new Error(`Error creating thread : ${error.message}`);
    }
}
export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    path: string
) {
    connectToDb();
    try {
        // find the Orignal Id by its Id and added it to the children
        const orignalThread = await Thread.findById(threadId)
        if(!orignalThread){
            throw new Error(`Thread Not Found`);
        }
        const commentThread = new Thread({
            text:commentText,
            author:userId,
            parentId:threadId,
        })
        //save the thread 
        const savedCommentThread = await commentThread.save()
        //update the original Thread 
        orignalThread.children.push(savedCommentThread._id)
        //save the oringal thread 
        await orignalThread.save()
        revalidatePath(path)
    } catch (error: any) {
        throw new Error(`Error creating thread : ${error.message}`);
    }
}
