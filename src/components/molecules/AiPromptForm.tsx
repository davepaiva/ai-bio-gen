"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { generateBio } from "@/utils/apiClient";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { useState } from "react";
import { IGenerateBioResponse } from "@/app/api/generate-bio/route";

const toneEnumArray = ["funny", "professional", "sarcastic", "quirky"] as const;

export const formSchema = z.object({
	tone: z.enum(toneEnumArray),
	temperature: z.string(),
	prompt: z
		.string()
		.min(5, { message: "Prompt should be a minimum of 5 characters" })
		.max(300, { message: "Prompt should be a maximum of 30 characters" }),
});

const AiPromptForm = () => {
	const [formResult, setFormResult] = useState<IGenerateBioResponse>();
	const { toast } = useToast();

	console.log("formResult", formResult);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			tone: "funny",
			temperature: "0.7",
			prompt: "",
		},
	});

	const { errors, isSubmitting } = form.formState;

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const result = await generateBio({
				tone: values.tone,
				temperature: parseInt(values.temperature || "0.7"),
				bio: values.prompt,
			});
			console.log("result: ", result);
			if (result) {
				setFormResult(result);
				toast({
					title: "Bio and username generated",
				});
			}
		} catch (error) {
			toast({
				title: "Error submitting review",
				description: "There was an error submitting your review",
				variant: "destructive",
			});
			console.error(error);
		}
	}

	return (
		<>
			<div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="items-center jsutify-center"
					>
						<FormField
							control={form.control}
							name="prompt"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											className="mt-[12px]"
											placeholder="Tell us a few sentences about yourself"
											{...field}
										/>
									</FormControl>
									<FormMessage>
										{!!errors.prompt && errors.prompt.message}
									</FormMessage>
								</FormItem>
							)}
						/>
						<div className="flex flex-col  justify-center gap-[32px] mt-[32px]">
							<FormField
								control={form.control}
								name="tone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Choose the tone of the generated bio & usernames
										</FormLabel>
										<FormControl>
											<RadioGroup
												defaultValue={field.value}
												onValueChange={field.onChange}
												value={field.value}
											>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="funny" id="r1" />
													<Label htmlFor="r1">Funny</Label>
												</div>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="professional" id="r2" />
													<Label htmlFor="r2">Professional</Label>
												</div>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="sarcastic" id="r3" />
													<Label htmlFor="r3">Sarcastic</Label>
												</div>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="quirky" id="r4" />
													<Label htmlFor="r4">Quirky</Label>
												</div>
											</RadioGroup>
										</FormControl>
										<FormMessage>
											{!!errors.tone && errors.tone.message}
										</FormMessage>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="temperature"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Temperature</FormLabel>
										<FormDescription>
											Higher the temperature, the more creative the generated
											bio will be
										</FormDescription>
										<Select
											onValueChange={field.onChange}
											defaultValue={`${field.value}`}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select temperature" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Array.from(
													{ length: 10 },
													(_, i) => (i + 1) * 0.1
												).map((value) => (
													<SelectItem key={value} value={`${value}`}>
														{value.toFixed(1)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage>
											{!!errors.temperature && errors.temperature.message}
										</FormMessage>
									</FormItem>
								)}
							/>
						</div>
						<div className="flex w-full justify-center mt-[64px]">
							<Button
								className="w-full max-w-[400px]"
								isLoading={isSubmitting}
								type="submit"
							>
								Submit
							</Button>
						</div>
					</form>
				</Form>
			</div>
			<div>
				{!!formResult && !isSubmitting && (
					<div className="flex flex-col items-center justify-center gap-[32px] mt-[64px] text-center">
						<h1 className="text-2xl font-bold">Result: </h1>
						<div>
							<h1 className="text-xl font-semibold">bio</h1>
							<p>{formResult?.data.result.bio}</p>
						</div>
						<div>
							<h1 className="text-xl font-semibold">usernames</h1>
							<p>{formResult?.data.result.generated_usernames.join(", ")}</p>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default AiPromptForm;
