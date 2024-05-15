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
	// error in logging should not affect the rest if the api, instead print it out
	try {
		return await prisma.openAiApiLog.create({
			data: {
				request_data: requestData,
				response_data: responseData,
				user_id: userId,
				is_success: isSuccess,
			},
		});
	} catch (error) {
		console.log(
			"ERROR data:",
			`user_id: ${userId}
        ------
        payload ${requestData}
        -----
        response ${responseData}
        -----
        error ${error}
        `
		);
	}
}

export const checkSystemResponseStatus = (finishReason: FinishReason) => {
	if (finishReason === "stop") {
		return true;
	}
	return false;
};
