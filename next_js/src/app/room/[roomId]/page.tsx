"use client";
import Streams from "@/components/Streams";
import { NUser } from "@/lib/types";
import { socket } from "@/providers/SocketProvider";
import { useUser } from "@/providers/UserProvider";
import { useEffect, useState } from "react";
// import Streams from "./Streams";
// import toast from "react-hot-toast";

export default function Page({
	params: { roomId },
}: {
	params: { roomId: string };
}) {
	const { user } = useUser();

	const [myPeer, setMyPeer] = useState<NUser>(null);
	const [didIWin, setDidIWin] = useState(false);

	useEffect(() => {
		if (!user) return;
		socket.emit("joined-room", {
			roomId,
			user,
		});
		socket.on("new-user-joined", (userE: NUser) => {
			//mai jeeta
			setMyPeer({ ...userE });
			socket.emit("introduce-me", { roomId, user });
			console.log("I am offerer: Peer is ", userE.username);
			setDidIWin(true);
		});
		socket.on("prev-user-introduction", (userE: NUser) => {
			setMyPeer({ ...userE });
			console.log("I am reciever: Peer is ", userE.username);
			setDidIWin(false);
		});
		socket.on("i-am-leaving", () => {
			console.log("peer left");
			setMyPeer(null);
		});

		const beforeUnload = () => socket.emit("leave-room", roomId);
		window.addEventListener("beforeunload", beforeUnload);
		return () => {
			socket.removeAllListeners();
			window.removeEventListener("beforeunload", beforeUnload);
		};
	}, [roomId, user]);
	return (
		<section>
			<p>
				{myPeer ? myPeer.email + " : " + myPeer.username : "Nobody"} is here!
			</p>
			{myPeer && <Streams didIWin={didIWin} roomId={roomId} />}
		</section>
	);
}
