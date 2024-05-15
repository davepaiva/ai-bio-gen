"use client";
import GoogleSignInButton from "@/components/molecules/GoogleSignInButton";
import { apiClient } from "@/utils/apiClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserStore } from "../store/user";

export default function LandingPage() {
	const router = useRouter();

	useEffect(() => {
		const accessToken = localStorage.getItem("access_token");
		const user = localStorage.getItem("user");
		if (!!accessToken && !!user) {
			apiClient.defaults.headers.common[
				"Authorization"
			] = `Bearer ${accessToken}`;
			useUserStore.setState({
				user: JSON.parse(user),
			});
			router.replace("/home");
		}
	}, []);

	return (
		<main className="flex min-h-screen justify-center items-center p-24">
			<div className="flex flex-col items-center">
				<h1 className="font-semibold text-gray-900 text-4xl text-center">
					Spice up your social media game 💪🏽
				</h1>
				<p className="text-gray-500 text-lg text-center">
					Generate a unique bio for your social media profiles
				</p>
				<GoogleSignInButton className="mt-[16px]" />
			</div>
		</main>
	);
}
