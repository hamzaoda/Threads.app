import React from "react";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import Link from "next/link";
import Image from "next/image";


async function Page() {
    const user = await currentUser();
    if (!user) return null;
    const userInfo = await fetchUser(user.id);
    //check if the user has not gone throug the onboarding page
    if (!userInfo?.onboarded) redirect("/onboarding");
    const activity = await getActivity(userInfo._id)
  return (
    <section>
        <h1 className='head-text mb-10'>Activity</h1>
        <section className="mt-10 flex flex-col gap-5">
          {activity.length > 0 ? (
            <>
            {activity.map((activity=>(
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className="activity-card">
                  <Image src={activity.author.image} alt="Profile Picture" height={20} width={20} className="rounded-full object-cover"/>
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {activity.author.name}
                    </span>{" "}
                    replied to your thread
                  </p>
                </article>
              </Link>
            )))}
            </>
          ): <p className="!text-base-regular text-light-3">No Activity Yet</p>}
        </section>
    </section>
  )
}

export default Page