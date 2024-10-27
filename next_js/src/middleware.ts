import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
	const token = req.cookies.get("token")?.value;
	// console.log({ token });

	if (!token) return NextResponse.redirect(new URL("/form", req.url));

	try {
		const secretKeyUint8 = new TextEncoder().encode(process.env.JWT_SECRET!);
		const { payload } = await jwtVerify(token, secretKeyUint8);
		console.log({ payload });

		return NextResponse.next();
	} catch (error) {
		if ((error as Error).name === "TokenExpiredError")
			console.error("Token expired:", (error as Error).message);
		else console.error("JWT verification failed:", (error as Error).message);

		return NextResponse.redirect(new URL("/form", req.url));
	}
}

export const config = {
	matcher: ["/"],
};
