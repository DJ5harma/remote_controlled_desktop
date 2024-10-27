"use client";
import { socket } from "@/providers/SocketProvider";
// import { useRoom } from "@/providers/RoomProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
	const router = useRouter();
	const [newRoomId, setNewRoomId] = useState("");
	const [enteredId, setEnteredId] = useState("");

	// const { setRoom } = useRoom();

	useEffect(() => {
		socket.on("incoming-new-room-id", (roomId) => {
			console.log({ roomId });

			setNewRoomId(roomId);
		});
		return () => {
			socket.removeAllListeners();
		};
	}, []);

	function createRoom() {
		console.log({ socket });

		socket?.emit("create-room");
	}

	function joinRoom(roomId: string) {
		// setRoom((p) => ({ ...p, roomId }));
		router.push(`room/${roomId}`);
	}

	return (
		<section className="gap-4">
			{newRoomId ? (
				<>
					<p>Your room id is:</p>
					<p className="bg-black text-white rounded-full py-2 px-4">
						{newRoomId}
					</p>
					<button onClick={() => joinRoom(newRoomId)}>Join there!</button>
				</>
			) : (
				<>
					<h1>Create a new room....</h1>
					<button onClick={createRoom}>Create now</button>
					<p>Or Join room by entering roomId: </p>
					<input
						type="text"
						className="w-full"
						placeholder="uuid"
						value={enteredId}
						onChange={(e) => setEnteredId(e.target.value)}
					/>
					<button onClick={() => joinRoom(enteredId)}>Join</button>
				</>
			)}
		</section>
	);
}
