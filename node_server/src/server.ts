import { Server } from "socket.io";
import dotenv from "dotenv";
import { v7 as uuid } from "uuid";

dotenv.config();
interface NUser {
	_id: string;
	username: string;
	email: string;
}

interface NRoom {
	Peer1?: NUser;
	Peer2?: NUser;
	roomId: string;
}

const PORT = 3001;
const io = new Server({
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

const roomMap = new Map<string, NRoom>(); // roomId -> joiners{}

io.listen(PORT);
console.log("Socket running at " + PORT);

let clients = 0;
io.on("connection", (socket) => {
	clients++;
	console.log("clients: " + clients);

	socket.on("create-room", () => {
		const newRoomId = uuid();
		roomMap.set(newRoomId, { roomId: newRoomId });
		socket.emit("incoming-new-room-id", newRoomId);
	});

	socket.on("joined-room", ({ roomId, user }) => {
		console.log("user " + user.username + " has joined the room", { roomMap });
		let room = roomMap.get(roomId);
		if (!room) {
			room = { Peer1: user, roomId, Peer2: undefined } as NRoom;
			socket.join(roomId);
		} else {
			room.Peer2 = { ...user };
			socket.broadcast.to(roomId).emit("loser-joined", room);
			socket.to(socket.id).emit("winner-was", room);
			socket.join(roomId);
		}
		roomMap.set(roomId, { ...room, roomId });
	});

	socket.on("my-offerD", ({ offerD, roomId }) => {
		socket.broadcast.to(roomId).emit("incoming-offerD", offerD);
	});
	socket.on("my-answerD", ({ answerD, room }) => {
		socket.broadcast.to(room).emit("incoming-answerD", answerD);
	});
	socket.on("my-ice-candidate", ({ iceCandidate, room }) => {
		socket.broadcast.to(room).emit("incoming-ice-candidate", iceCandidate);
	});

	socket.on("leave-room", ({ roomId, user }) => {
		if (!user) return;
		const room = roomMap.get(roomId);
		if (!room) return;

		if (room.Peer1?._id !== user._id && room.Peer2?._id !== user._id) return;
		if (room.Peer1?._id === user._id) delete room.Peer1;
		else if (room.Peer2?._id === user._id) delete room.Peer2;
		else return;
		socket.leave(roomId);

		roomMap.set(roomId, { ...room });
		console.log(`${user.username} left and new room is: `, room);

		socket.to(roomId).emit("i-am-leaving");
	});

	socket.on("disconnect", () => {
		clients--;
		console.log("clients: " + clients);
		console.log({ roomMap });
	});
});
