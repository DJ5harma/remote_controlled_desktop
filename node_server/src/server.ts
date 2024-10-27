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

io.listen(PORT);
console.log("Socket running at " + PORT);

let clients = 0;
io.on("connection", (socket) => {
	clients++;
	console.log("clients: " + clients);

	socket.on("create-room", () => {
		const newRoomId = uuid();
		socket.emit("incoming-new-room-id", newRoomId);
	});

	socket.on("joined-room", ({ roomId, user }) => {
		socket.broadcast.to(roomId).emit("new-user-joined", user);
		socket.join(roomId);
	});
	socket.on("introduce-me", ({ roomId, user }) =>
		socket.broadcast.to(roomId).emit("prev-user-introduction", user)
	);

	socket.on("leave-room", (roomId) => {
		socket.broadcast.to(roomId).emit("i-am-leaving");
		socket.leave(roomId);
	});

	socket.on("my-offerD", ({ offerD, roomId }) => {
		socket.broadcast.to(roomId).emit("incoming-offerD", offerD);
	});
	socket.on("my-answerD", ({ answerD, roomId }) => {
		socket.broadcast.to(roomId).emit("incoming-answerD", answerD);
	});
	socket.on("my-ice-candidate", ({ iceCandidate, roomId }) => {
		socket.broadcast.to(roomId).emit("incoming-ice-candidate", iceCandidate);
	});

	socket.on("disconnect", () => {
		clients--;
		console.log("clients: " + clients);
		// console.log({ roomMap });
	});
});
