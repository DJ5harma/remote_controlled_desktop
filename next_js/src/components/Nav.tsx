"use client";
import { useUser } from "@/providers/UserProvider";
import { usePathname } from "next/navigation";

export default function Nav() {
	const pathname = usePathname();
	const { user } = useUser();
	if (pathname === "/form") return;
	return (
		<nav
			className="flex items-center justify-between bg-white px-4"
			style={{ height: "10vh" }}
		>
			<h1>Remote Desktop</h1>
			<p>{user ? user.username : "Loading..."}</p>
		</nav>
	);
}
