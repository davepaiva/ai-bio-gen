import { PrismaClient } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/react-native.js";

export type FinishReason = "stop" | "max_tokens" | "none";

const prisma = new PrismaClient();

export async function logOpenAiApiCall(
	requestData: JsonObject,
	responseData: JsonObject,
	userId: string,
	isSuccess: boolean
) {
	return await prisma.openAiApiLog.create({
		data: {
			reqquest_data: requestData,
			response_data: responseData,
			user_id: userId,
			is_success: isSuccess,
		},
	});
}

export async function getServerLogs(page: number, pageSize: number) {
	const skip = (page - 1) * pageSize;
	const logs = await prisma.openAiApiLog.findMany({
		skip: skip,
		take: pageSize,
		orderBy: {
			timestamp: "desc",
		},
	});
	return logs;
}

export const checkSystemResponseStatus = (finishReason: FinishReason) => {
	if (finishReason === "stop") {
		return true;
	}
	return false;
};
