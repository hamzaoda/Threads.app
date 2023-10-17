import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

async function ThreadDetails({ params }: { params: { id: string } }) {
    //check if the thread exists
    if (!params.id) return null;
    const user = await currentUser();
    //check if the user exists
    if (!user) return null;
    const userInfo = await fetchUser(user.id);
    //check if the user is go through onboarding
    if (!userInfo.onboarded) redirect("/onboarding");
    const thread = await fetchThreadById(params.id);
    return (
        <section className="relative">
            <div>
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={user?.id || ""}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                    isComment={false}
                />
            </div>
            <div className="mt-7 ">
                <Comment
                    threadId={thread.id}
                    currentUserImage={userInfo.image}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>
            <div className="mt-10">
                {thread.children.map((child: any) => (
                    <ThreadCard
                        key={child._id}
                        id={child._id}
                        currentUserId={user?.id || ""}
                        parentId={child.parentId}
                        content={child.text}
                        author={child.author}
                        community={child.community}
                        createdAt={child.createdAt}
                        comments={child.children}
                        isComment
                    />
                ))}
            </div>
        </section>
    );
}

export default ThreadDetails;
