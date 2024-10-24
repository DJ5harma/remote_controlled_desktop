"use client";
import { hardCodedUser } from "@/lib/hardcoded";
import { IUser } from "@/lib/types";
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
		const { errMessage, user } = (await axios.get(`/api/auth/login`)).data;
		if (errMessage) return router.replace("/form");
		setUser(user);
	}
	useEffect(() => {
		autoLogin();
	}, []);

	return (
		<context.Provider value={{ user, setUser }}>{children}</context.Provider>
	);
};

export const useUser = () => {
	return useContext(context);
};
