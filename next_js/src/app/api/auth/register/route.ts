import dbConnect from "@/lib/dbConnect";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import USER from "@/models/USER.MODEL";
export const POST = async (req: NextRequest) => {
	try {
		const { username, password, email, confirmPassword } = await req.json();
		if (!username || !email)
			throw new Error("Please enter all the credentials!");
		if (password.length < 6) throw new Error("Password too short");
		if (password !== confirmPassword) throw new Error("Passwords must match");

		await dbConnect();
		if (await USER.exists({ email }))
			throw new Error("Email already registered");

		const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
		const user = new USER({
			username,
			hashedPassword,
			email,
			friends: [],
		});
		const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET!);
		await user.save();

		delete user.hashedPassword;
		cookies().set("token", token);
		cookies().set("user_id", user._id);

		return NextResponse.json({
			user,
		});
	} catch (error) {
		return NextResponse.json({
			errMessage: (error as Error).message || "Internal server error",
		});
	}
};
