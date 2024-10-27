"use client";
import { NRoom } from "@/lib/types";
import React, {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useState,
} from "react";

const context = createContext<{
	room: NRoom;
	setRoom: Dispatch<SetStateAction<NRoom>>;
}>({
	room: undefined,
	setRoom: () => {},
});
export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
	const [room, setRoom] = useState<NRoom>(undefined);
	return (
		<context.Provider value={{ room, setRoom }}>{children}</context.Provider>
	);
};

export const useRoom = () => {
	return useContext(context);
};
