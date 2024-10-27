"use client";
import { IUser } from "@/lib/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, {
	createContext,
	Dispatch,
	SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { socket } from "./SocketProvider";
const context = createContext<{
	user: IUser;
	setUser: Dispatch<SetStateAction<IUser>>;
}>({
	user: undefined,
	setUser: () => {},
});
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<IUser>(undefined);
	const router = useRouter();

	const autoLogin = useCallback(async () => {
		const { user, errMessage } = (await axios.get(`/api/auth/login`)).data;
		console.log({ errMessage });

		if (errMessage) return router.replace("/form");
		setUser((p) => ({ ...p, ...user }));
	}, [router]);
	useEffect(() => {
		autoLogin();
		return () => {
			socket.disconnect();
		};
	}, [autoLogin]);

	return (
		<context.Provider value={{ user, setUser }}>{children}</context.Provider>
	);
};

export const useUser = () => {
	return useContext(context);
};
