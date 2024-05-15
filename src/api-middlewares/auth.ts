import { sendResponse } from "@/utils/apiResponseFormatter";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export const authMiddleware = async (request: NextRequest) => {
	if (request.nextUrl.pathname === "/api/auth") {
		return NextResponse.next();
	}
	const token = request.headers.get("Authorization")?.split(" ")[1];
	if (!token) {
		return sendResponse({
			code: "UNAUTHORIZED",
			message: "Authorization token is missing",
			status: 401,
		});
	}

	try {
		const jwtConfig = {
			secret: new TextEncoder().encode(process.env.JWT_SECRET),
		};
		const decoded = await jose.jwtVerify(token, jwtConfig.secret);
		const headers = new Headers(request.headers);
		headers.set("user", JSON.stringify(decoded.payload));

		const resp = NextResponse.next({
			request: {
				headers,
			},
		});
		return resp;
	} catch (error) {
		return sendResponse({
			code: "UNAUTHORIZED",
			message: "Invalid token",
			status: 403,
		});
	}
};
