"use client";
import { io, Socket } from "socket.io-client";
import { useEffect } from "react";
import toast from "react-hot-toast";

export let skt: null | Socket = null;
export default function ClientSocketProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	useEffect(() => {
		skt = io("http://localhost:3001");
		skt.on("hi", () => toast("Hi from socket server"));

		return () => {
			if (skt) {
				skt.disconnect();
				skt.removeAllListeners();
				toast("Socket cleanup");
			}
		};
	}, []);
	return <>{children}</>;
}
