"use client";

import Link from "next/link";
import { sidebarLinks } from "../../constants/index";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs";

function LeftSideBar() {
    const router = useRouter();
    const pathName = usePathname();
    const {userId} =useAuth()
    return (
        <>
            <section className="custom-scrollbar leftsidebar ">
                <div className="flex w-full flex-1 flex-col gap-6 px-6">
                    {sidebarLinks.map((link) => {
                        // we check the path name and the route to make isActive true
                        const isActive =
                            (pathName.includes(link.route) &&
                                link.route.length > 1) ||
                            pathName === link.route;
                        if(link.route === '/profile') link.route = `${link.route}/${userId}`
                        return (
                            // in the class name we use is active to make the icon on the left side bar have a blue color when active
                            <Link
                                href={link.route}
                                key={link.label}
                                className={`leftsidebar_link ${
                                    isActive && "bg-primary-500"
                                }`}
                            >
                                <Image
                                    src={link.imgURL}
                                    alt={link.label}
                                    width={24}
                                    height={24}
                                />
                                <p className="text-light-1 max-lg:hidden">
                                    {link.label}
                                </p>
                            </Link>
                        );
                    })}
                </div>
                <div className="mt-10 px-6">
                    <SignedIn>
                        <SignOutButton
                            signOutCallback={() => router.push("/sign-in")}
                        >
                            <div className="flex cursor-pointer gap-4 p-4">
                                <Image
                                    className=""
                                    src="/assets/logout.svg"
                                    alt="logout"
                                    width={24}
                                    height={24}
                                />
                                <p className="text-light-2 max-lg:hidden ">
                                    Logout
                                </p>
                            </div>
                        </SignOutButton>
                    </SignedIn>
                </div>
            </section>
        </>
    );
}

export default LeftSideBar;
