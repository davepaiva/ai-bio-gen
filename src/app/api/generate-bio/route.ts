import { NextRequest } from "next/server";
import axios, { AxiosResponse } from "axios";
import {
	FinishReason,
	checkSystemResponseStatus,
	logOpenAiApiCall,
} from "@/utils/logApiCall";
import { JsonObject } from "@prisma/client/runtime/react-native.js";
import { sendResponse } from "@/utils/apiResponseFormatter";
import { OpenAIResponseSchema } from "@/zod-schema/openAiApiSchema";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export interface IGenerateBioRequest {
	bio: string;
	tone: string;
	temperature: number;
}

export interface IGenerateBioResponse {
	code: string;
	message: string;
	data: {
		id: string;
		timestamp: string;
		result: {
			bio: string;
			generated_usernames: string[];
		};
	};
}

export interface IHistoryListResponse {
	code: string;
	message: string;
	data: IHistoryItem[];
}
export interface IHistoryItem {
	id: string;
	timestamp: string;
	bio: string;
	generated_usernames: string[];
	tone: string;
	temperature: number;
	input_text: string;
}

interface IOpenAIResponseBody {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: {
		index: number;
		finish_reason: string;
		logprobs: any;
		message: {
			role: string;
			content: string;
		};
	}[];
	usage: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
	system_fingerprint: any;
}

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
	const { bio, tone, temperature = 0.7 } = await req.json();
	const user = JSON.parse(req.headers.get("user") || "{}");
	const user_id = user.userId;

	const systemPrompt = `Generate a social media profile bio and suggested 3 usernames based on the user bio input and tone input:
  The response should be in JSON format. With keys "bio" for the generated profile bio & "generated_usernames" for the genrated usernames.
  Give username values as a n array of strings ie. ['@username1', '@username2', '@username3']`;

	const userPrompt = `Bio: ${bio}, Tone: ${tone}`;

	try {
		const payload = {
			method: "post",
			url: `${process.env.OPEN_AI_API_URL}`,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
			},
			data: {
				temperature: temperature,
				response_format: { type: "json_object" },
				model: process.env.OPEN_AI_MODEL,
				messages: [
					{
						role: "system",
						content: systemPrompt,
					},
					{
						role: "user",
						content: userPrompt,
					},
				],
			},
		};
		const response: AxiosResponse<IOpenAIResponseBody> = await axios(payload);
		const openAiResponse = response.data;

		const schemaValidationResult =
			OpenAIResponseSchema.safeParse(openAiResponse);
		if (!schemaValidationResult.success) {
			return sendResponse({
				code: "VALIDATION_ERROR",
				message: `Response validation failed with error ${schemaValidationResult.error}`,
				status: 400,
			});
		}

		const logResult = await logOpenAiApiCall(
			payload,
			openAiResponse as any as JsonObject,
			user_id,
			checkSystemResponseStatus(
				(openAiResponse.choices[0].finish_reason as FinishReason) ||
					("none" as FinishReason)
			)
		);

		await prisma.userHistory.create({
			data: {
				logId: logResult?.id || uuidv4(),
				user_id: user_id,
				tone: tone,
				temperature: temperature,
				generated_usernames: JSON.parse(
					openAiResponse.choices[0].message.content || "{}"
				).generated_usernames,
				bio: bio,
				input_text: userPrompt,
			},
		});

		// excpected output as per API docs example https://platform.openai.com/docs/guides/text-generation/chat-completions-response-format
		switch (openAiResponse.choices[0].finish_reason) {
			case "stop":
				return sendResponse({
					code: "SUCCESS",
					message: "success",
					data: {
						id: logResult?.id,
						result: JSON.parse(
							openAiResponse.choices[0].message.content || "{}"
						),
						timestamp: logResult?.timestamp,
					},
				});
			case "max_tokens":
				return sendResponse({
					code: "MAX_TOKENS",
					message: "Max tokens reached",
					status: 400,
				});
			case "none":
				return sendResponse({
					code: "NO_RESPONSE",
					message: "No response from AI",
					status: 500,
				});
		}
	} catch (error) {
		console.error("Error calling OpenAI API:", error);
		return sendResponse({
			code: "INTERNAL_ERROR",
			message: "Error processing your request",
			status: 500,
		});
	}
};

export const GET = async (req: NextRequest) => {
	try {
		const user = JSON.parse(req.headers.get("user") || "{}");
		const user_id = user.userId;
		const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
		const pageSize = parseInt(
			req.nextUrl.searchParams.get("pageSize") || "10",
			10
		);
		const skip = (page - 1) * pageSize;

		const logs = await prisma.userHistory.findMany({
			skip: skip,
			take: pageSize,
			select: {
				id: true,
				timestamp: true,
				bio: true,
				generated_usernames: true,
				tone: true,
				temperature: true,
				input_text: true,
			},
			where: {
				user_id: user_id,
			},
			orderBy: {
				timestamp: "desc",
			},
		});
		return sendResponse({
			code: "SUCCESS",
			message: "success",
			data: logs,
		});
	} catch (error) {
		console.error("Error getting server logs:", error);
		return sendResponse({
			code: "INTERNAL_ERROR",
			message: "Error getting server logs",
			status: 500,
		});
	}
};
