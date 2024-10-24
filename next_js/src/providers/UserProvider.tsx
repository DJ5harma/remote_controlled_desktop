"use client";
import { hardCodedUser } from "@/lib/hardcoded";
import { IUser } from "@/lib/types";
import { getSocket } from "@/socketClient/socket";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import toast from "react-hot-toast";
const context = createContext<{
	user: IUser;
	setUser: Dispatch<SetStateAction<IUser>>;
}>({
	user: hardCodedUser,
	setUser: () => {},
});
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<IUser>(hardCodedUser);
	const router = useRouter();
	async function autoLogin() {
		const { user, errMessage } = (await axios.get(`/api/auth/login`)).data;
		console.log(user);

		if (errMessage) return router.replace("/form");
		setUser((p) => ({ ...p, ...user }));
	}
	useEffect(() => {
		autoLogin();
		const skt = getSocket();
		skt.on("hi", () => toast("Socket connected to server"));
	}, []);

	return (
		<context.Provider value={{ user, setUser }}>{children}</context.Provider>
	);
};

export const useUser = () => {
	return useContext(context);
};
