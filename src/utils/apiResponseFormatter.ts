import { NextResponse } from "next/server";

interface ApiResponse {
	code: string;
	message: string;
	data?: any;
	status?: number;
}

export function sendResponse({
	code,
	message,
	data = null,
	status = 200,
}: ApiResponse) {
	return NextResponse.json(
		{
			code,
			message,
			data,
		},
		{ status }
	);
}
