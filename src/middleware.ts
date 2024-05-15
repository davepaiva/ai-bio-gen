import { NextResponse, type NextRequest } from "next/server";
import { authMiddleware } from "@/api-middlewares/auth";

export async function middleware(request: NextRequest) {
	const authMiddlewareResponse = await authMiddleware(request);
	if (authMiddlewareResponse) {
		return authMiddlewareResponse;
	}

	// import other middleware and add it here in sequential order to chain various middlewares
	// for rate limiting , we can define another middleware and add it here
	// broad level logic for rate limiting middleware is for the nginx to foward the ip address ,
	//we then store requests in redis and check if the ip is allowed to make more requests for a window of time

	// const rateLimitWindowMs = 15 * 60 * 1000; // 15 minutes
	// const maxRequestsPerWindow = 100; // Max 100 requests per IP per window
	// const requestCounts = new Map(); // this will store the request counts for each IP, mimicing the redis cache
	// function rateLimit(request: NextRequest) {
	// 	const ip = request.ip;
	// 	const now = Date.now();
	// 	const timestamps = requestCounts.get(ip) || [];

	// 	// Filter out requests that are older than the rate limit window
	// 	const recentTimestamps = timestamps.filter(
	// 		(timestamp: number) => now - timestamp < rateLimitWindowMs
	// 	);
	// 	recentTimestamps.push(now);
	// 	requestCounts.set(ip, recentTimestamps);

	// 	return recentTimestamps.length > maxRequestsPerWindow;
	// }

	// if (rateLimit(request)) {
	//     return sendResponse({
	//         code: "TOO_MANY_REQUESTS",
	//         message: "Too many requests, please try again later.",
	//         status: 429,
	//     });
	// }

	return NextResponse.next();
}
export const config = {
	matcher: ["/api/:path*"],
};
