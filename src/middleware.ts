// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
	const token = req.cookies.get("token")?.value;

	if (!token) return NextResponse.redirect(new URL("/form", req.url));

	try {
		const secretKeyUint8 = new TextEncoder().encode(process.env.JWT_SECRET!);
		const { payload } = await jwtVerify(token, secretKeyUint8);

		const res = NextResponse.next();
		if (!res.cookies.get("user_id"))
			res.cookies.set("user_id", (payload as { user_id: string }).user_id);
		return res;
	} catch (error) {
		if ((error as Error).name === "TokenExpiredError") {
			console.error("Token expired:", (error as Error).message);
		} else {
			console.error("JWT verification failed:", (error as Error).message);
		}
		return NextResponse.redirect(new URL("/form", req.url));
	}
}

export const config = {
	matcher: ["/"],
};
