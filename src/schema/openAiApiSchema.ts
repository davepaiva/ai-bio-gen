import { z } from "zod";

// Define the Zod schema based on IOpenAIResponseBody
const ChoiceSchema = z.object({
	index: z.number(),
	finish_reason: z.string(),
	logprobs: z.unknown(),
	message: z.object({
		role: z.string(),
		content: z.string(),
	}),
});

const UsageSchema = z.object({
	prompt_tokens: z.number(),
	completion_tokens: z.number(),
	total_tokens: z.number(),
});

export const OpenAIResponseSchema = z.object({
	id: z.string(),
	object: z.string(),
	created: z.number(),
	model: z.string(),
	choices: z.array(ChoiceSchema),
	usage: UsageSchema,
	system_fingerprint: z.unknown(),
});
