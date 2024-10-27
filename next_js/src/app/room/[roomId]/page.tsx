"use client";
import { NRoom } from "@/lib/types";
import { useRoom } from "@/providers/RoomProvider";
import { useSocket } from "@/providers/SocketProvider";
import { useUser } from "@/providers/UserProvider";
import { useEffect } from "react";

export default function Page({
	params: { roomId },
}: {
	params: { roomId: string };
}) {
	const { user } = useUser();
	const { setRoom } = useRoom();
	const socket = useSocket();

	useEffect(() => {
		if (!socket || !user) return;
		socket.emit("joined-room", {
			roomId,
			user: { ...user, friends: undefined },
		});
		socket.on("room-update", (room: NRoom) => {
			setRoom(room);
			if (room?.Peer1?._id === user._id) {
			}
		});
		return () => {
			socket.removeAllListeners();
		};
	}, [roomId, setRoom, socket, user]);
	return <section>users</section>;
}
