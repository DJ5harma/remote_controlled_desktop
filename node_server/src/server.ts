import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { v7 as uuid } from "uuid";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

app.use(cors());

interface NRoom {
	Peer1?: Object;
	Peer2?: Object;
	roomId: string;
}
const roomMap = new Map<string, NRoom>(); // roomId -> joiners{}

let clients = 0;
io.on("connection", (socket) => {
	clients++;
	console.log({ clients });

	socket.on("create-room", () => {
		const newRoomId = uuid();
		roomMap.set(newRoomId, { roomId: newRoomId });
		socket.emit("incoming-new-room-id", newRoomId);
	});
	socket.on("joined-room", ({ roomId, user }) => {
		const room = roomMap.get(roomId);
		if (!room)
			return socket
				.to(socket.id)
				.emit("error", "Room with provided id doesn't exist");
		if (!room.Peer1) room.Peer1 = user;
		else if (!room.Peer2) room.Peer2 = user;
		else
			return socket
				.to(socket.id)
				.emit("error", "Room already has two (max) Peers");

		roomMap.set(roomId, room);
		socket.join(roomId);
		socket.to(roomId).emit("room-update", room);
	});

	socket.on("my-offerD", ({ offerD, room }) => {
		// console.log("new offerD");
		socket.broadcast.to(room).emit("incoming-offerD", offerD);
	});
	socket.on("my-answerD", ({ answerD, room }) => {
		// console.log("new answerD");
		socket.broadcast.to(room).emit("incoming-answerD", answerD);
	});
	socket.on("my-ice-candidate", ({ iceCandidate, room }) => {
		// console.log("ice-candidate arrived");
		socket.broadcast.to(room).emit("incoming-ice-candidate", iceCandidate);
	});

	socket.on("leave-room", ({ roomId, user }) => {
		const room = roomMap.get(roomId);
		if (!room || (room.Peer1 !== user && room.Peer2 !== user)) return;

		if (room.Peer1 === user) room.Peer1 = undefined;
		else if (room.Peer2 === user) room.Peer2 = undefined;
		else return;
		socket.leave(roomId);

		roomMap.set(roomId, room);
		socket.to(roomId).emit("i-am-leaving", room);
	});

	socket.on("disconnect", () => {
		clients--;
		console.log({ clients });
	});
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
	console.log(`node_server is running on ${PORT}`);
});
