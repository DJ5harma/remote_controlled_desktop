"use client";
import { IFormData, IFormType } from "@/lib/types";
import { useUser } from "@/providers/UserProvider";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Form() {
	const { setUser } = useUser();
	const [formType, setFormType] = useState<IFormType>("Login");

	const [formData, setFormData] = useState<IFormData>({
		username: "",
		confirmPassword: "",
		email: "",
		password: "",
	});

	const router = useRouter();

	async function handleAction() {
		toast.loading("Computing your request...");
		try {
			if (!formData.email) throw new Error("Please enter all the credentials!");
			if (formType === "Register") {
				if (!formData.username)
					throw new Error("Please enter all the credentials!");
				if (formData.password.length < 6) throw new Error("Password too short");
				if (formData.password !== formData.confirmPassword)
					throw new Error("Passwords must match");
			}

			const { errMessage, user } = (
				await axios.post(`/api/auth/${formType.toLowerCase()}`, formData)
			).data;
			toast.dismiss();
			if (errMessage) throw new Error(errMessage);
			setUser(user);
			toast.success(`${formType} action complete!`);

			router.replace("/");
		} catch (error) {
			toast.dismiss();
			toast.error((error as Error).message);
		}
	}

	return (
		<section className="h-screen">
			<section className="gap-2 py-4 px-6 rounded-3xl bg-white shadow-2xl">
				<h1>Remote Desktop</h1>
				{formType === "Register" && (
					<input
						onChange={(e) =>
							setFormData({ ...formData, username: e.target.value })
						}
						type="text"
						placeholder="Username"
					/>
				)}
				<input
					onChange={(e) => setFormData({ ...formData, email: e.target.value })}
					type="text"
					placeholder="Email"
				/>
				<input
					onChange={(e) =>
						setFormData({ ...formData, password: e.target.value })
					}
					type="password"
					placeholder={`password ${formType === "Register" ? "(min 6)" : ""}`}
				/>
				{formType === "Register" && (
					<input
						onChange={(e) =>
							setFormData({ ...formData, confirmPassword: e.target.value })
						}
						type="password"
						placeholder="confirm-password"
					/>
				)}
				<button onClick={handleAction}>{formType}</button>
			</section>
			<p
				className="cursor-pointer bg-purple-950 text-white rounded-full py-2 my-2 px-4"
				onClick={() =>
					setFormType((p) => (p === "Login" ? "Register" : "Login"))
				}
			>
				Or {formType === "Login" ? "Register!" : "Login!"}
			</p>
		</section>
	);
}
