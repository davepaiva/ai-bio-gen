import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify, SignJWT } from "jose";
import { sendResponse } from "@/utils/apiResponseFormatter";

const prisma = new PrismaClient();

interface User {
	id: string;
	name: string;
	email: string;
	profile_pic_url: string;
}

export interface IAuthResponse {
	code: string;
	message: string;
	data: {
		token: string;
		user: User;
	};
}

export interface IAuthRequest {
	name: string;
	email: string;
	profile_pic_url: string;
}

export const POST = async (req: NextRequest) => {
	try {
		const { name, email, profile_pic_url } = await req.json();

		// Create or update the user in the database
		const user = await prisma.user.upsert({
			where: { email },
			update: { name, profile_pic_url },
			create: { name, email, profile_pic_url: profile_pic_url },
		});

		const jwtSecretKey = new TextEncoder().encode(process.env.JWT_SECRET);
		const token = await new SignJWT({ userId: user.id, email: user.email })
			.setProtectedHeader({ alg: "HS256" })
			.setExpirationTime("24h")
			.sign(jwtSecretKey);

		return sendResponse({
			code: "SUCCESS",
			message: "User authenticated successfully",
			data: {
				token,
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					profile_pic_url: user.profile_pic_url,
				},
			},
			status: 200,
		});
	} catch (error) {
		console.log("error: ", error);
		return sendResponse({
			code: "ERROR",
			message: "Error processing your request",
			status: 500,
		});
	}
};
