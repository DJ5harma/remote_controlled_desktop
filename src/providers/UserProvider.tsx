"use client";
import { hardCodedUser } from "@/lib/hardcoded";
import { IUser } from "@/lib/types";
import React, {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useState,
} from "react";

const context = createContext<{
	user: IUser;
	setUser: Dispatch<SetStateAction<IUser>>;
}>({
	user: hardCodedUser,
	setUser: () => {},
});
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<IUser>(hardCodedUser);
	return (
		<context.Provider value={{ user, setUser }}>{children}</context.Provider>
	);
};

export const useUser = () => {
	return useContext(context);
};
