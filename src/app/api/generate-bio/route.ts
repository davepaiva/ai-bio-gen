import { NextRequest } from "next/server";
import axios, { AxiosResponse } from "axios";
import {
	FinishReason,
	checkSystemResponseStatus,
	getServerLogs,
	logOpenAiApiCall,
} from "@/utils/logApiCall";
import { JsonObject } from "@prisma/client/runtime/react-native.js";
import { sendResponse } from "@/utils/apiResponseFormatter";

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

export const POST = async (req: NextRequest) => {
	const { bio, tone, temperature = 0.7 } = await req.json();
	const user_id = "dave";

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
		try {
			// error in logging should not affect the rest if the api, instead print it out
			await logOpenAiApiCall(
				payload,
				openAiResponse as any as JsonObject,
				user_id,
				checkSystemResponseStatus(
					(openAiResponse.choices[0].finish_reason as FinishReason) ||
						("none" as FinishReason)
				)
			);
		} catch (error) {
			console.log(
				"ERROR data:",
				`user_id: ${user_id}
			------
			payload ${payload}
			-----
			response ${openAiResponse}
			-----
			error ${error}
			`
			);
		}

		// excpected output as per API docs example https://platform.openai.com/docs/guides/text-generation/chat-completions-response-format
		switch (openAiResponse.choices[0].finish_reason) {
			case "stop":
				return sendResponse({
					code: "SUCCESS",
					message: "success",
					data: JSON.parse(openAiResponse.choices[0].message.content || "{}"),
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
		const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
		const pageSize = parseInt(
			req.nextUrl.searchParams.get("pageSize") || "10",
			10
		);
		const logs = await getServerLogs(page, pageSize);
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
