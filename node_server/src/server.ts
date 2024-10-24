import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

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

io.on("connection", (socket) => {
	socket.emit("hi");
	console.log("New client connected: " + socket.id);

	socket.on("disconnect", () => {
		console.log("Client disconnected");
	});
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
	console.log(`node_server is running on ${PORT}`);
});
