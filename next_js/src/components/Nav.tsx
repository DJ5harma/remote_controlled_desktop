"use client";
import { useUser } from "@/providers/UserProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
	const { user } = useUser();
	const pathname = usePathname();

	if (pathname === "/form") return;
	return (
		<nav
			className="flex items-center justify-between bg-white px-4"
			style={{ height: "10vh" }}
		>
			<Link href={"/room"}>Room</Link>
			{/* <h1>Remote Desktop</h1> */}
			{user ? <p>{user.username}</p> : "Verifying..."}
		</nav>
	);
}
