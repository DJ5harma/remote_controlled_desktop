"use client";
import { NRoom, NUser } from "@/lib/types";
import { useRoom } from "@/providers/RoomProvider";
import { socket } from "@/providers/SocketProvider";
import { useUser } from "@/providers/UserProvider";
import { useCallback, useEffect, useState } from "react";
// import toast from "react-hot-toast";
import Streams from "./Streams";

export default function Page({
	params: { roomId },
}: {
	params: { roomId: string };
}) {
	const { user } = useUser();
	const { room, setRoom } = useRoom();

	const [myPeer, setMyPeer] = useState<NUser>(null);
	const [didIWin, setDidIWin] = useState(false);

	const registerRoom = useCallback(
		(room: NRoom) => {
			console.log("peer joined");
			const otherPeer: NUser =
				room.Peer1._id === user._id ? room.Peer2 : room.Peer1;
			console.log({ otherPeer });

			setMyPeer({ ...otherPeer });
			setRoom({ ...room });
		},
		[setRoom, user._id]
	);

	useEffect(() => {
		if (!user) return;

		socket.emit("joined-room", {
			roomId,
			user: { ...user, friends: undefined },
		});
		socket.on("loser-joined", (room: NRoom) => {
			registerRoom(room);
			setDidIWin(true);
		});
		socket.on("winner-was", (room: NRoom) => {
			registerRoom(room);
			setDidIWin(false);
		});
		socket.on("i-am-leaving", () => {
			"peer left";
			setMyPeer(null);
		});

		const handleBeforeUnload = () =>
			socket.emit("leave-room", { roomId, user });
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => {
			socket.removeAllListeners();
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [registerRoom, room, roomId, setRoom, user]);
	return (
		<section>
			<p>
				{myPeer ? myPeer.email + " : " + myPeer.username : "Nobody"} is here!
			</p>
			{room && room.roomId && room.Peer1 && room.Peer2 && (
				<Streams didIWin={didIWin} />
			)}
		</section>
	);
}
