"use client";
import { SOCKET_URL } from "@/lib/hardcoded";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useMemo,
} from "react";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";
import { useRoom } from "./RoomProvider";
import { useUser } from "./UserProvider";

const context = createContext<Socket | null>(null);

export default function SocketProvider({ children }: { children: ReactNode }) {
	const socket = useMemo(() => io(SOCKET_URL), []);
	const { room } = useRoom();

	const { user } = useUser();
	useEffect(() => {
		socket.on("error", (errMessage) => {
			toast.error(errMessage);
		});
		return () => {
			if (room?.roomId)
				socket.emit("i-am-leaving", { roomId: room?.roomId, user });
			socket.disconnect();
		};
	}, [room?.roomId, socket, user]);

	return <context.Provider value={socket}>{children}</context.Provider>;
}
export const useSocket = () => {
	return useContext(context);
};
