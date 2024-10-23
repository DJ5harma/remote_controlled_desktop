import dbConnect from "@/lib/dbConnect";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import USER from "@/models/USER.MODEL";

export const POST = async (req: NextRequest) => {
	try {
		const { password, email } = await req.json();

		await dbConnect();
		const user = await USER.findOne({ email });
		if (!user) throw new Error("Email not registered");
		if (!bcrypt.compareSync(password, user.hashedPassword))
			throw new Error("Wrong password");
		const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET!);
		cookies().set("token", token);

		console.log({ user });

		await user.save();
		return NextResponse.json({
			user: {
				_id: user._id,
				username: user.username,
				email,
			},
		});
	} catch (error) {
		return NextResponse.json({
			errMessage: (error as Error).message || "Internal server error",
		});
	}
};
