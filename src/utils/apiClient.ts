"use client";

import { IAuthRequest, IAuthResponse } from "@/app/api/auth/route";
import {
	IGenerateBioRequest,
	IGenerateBioResponse,
	IHistoryListResponse,
} from "@/app/api/generate-bio/route";
import { useUserStore } from "@/store/user";
import axios, { AxiosResponse } from "axios";

export const apiClient = axios.create({
	baseURL: process.env.BASE_API_URL,
});

if (typeof window !== "undefined") {
	apiClient.defaults.headers.common[
		"Authorization"
	] = `Bearer ${localStorage.getItem("access_token")}`;
}

export const getAccessToken: (
	authRequest: IAuthRequest
) => Promise<IAuthResponse> = async (authRequest: IAuthRequest) => {
	try {
		const response: AxiosResponse<IAuthResponse, IAuthRequest> =
			await apiClient.post("/api/auth", {
				name: authRequest.name,
				email: authRequest.email,
				profile_pic_url: authRequest.profile_pic_url,
			} as IAuthRequest);
		useUserStore.setState({
			user: {
				name: response.data.data.user.name,
				email: response.data.data.user.email,
				profile_pic_url: response.data.data.user.profile_pic_url,
			},
		});
		localStorage.setItem("access_token", response.data.data.token);
		localStorage.setItem("user", JSON.stringify(response.data.data.user));
		apiClient.defaults.headers.common[
			"Authorization"
		] = `Bearer ${response.data.data.token}`;

		return response.data;
	} catch (error) {
		console.error("Error sending POST request:", error);
		throw error;
	}
};

export const generateBio: (
	authRequest: IGenerateBioRequest
) => Promise<IGenerateBioResponse> = async ({
	bio,
	tone,
	temperature,
}: IGenerateBioRequest) => {
	try {
		const response = await apiClient.post("/api/generate-bio", {
			bio,
			tone,
			temperature,
		});
		return response.data;
	} catch (error) {
		console.error("Error sending POST request:", error);
		throw error;
	}
};

export const getHistory: () => Promise<IHistoryListResponse> = async () => {
	try {
		const response = await apiClient.get("/api/generate-bio");
		return response.data;
	} catch (error) {
		console.error("Error sending GET request:", error);
		throw error;
	}
};
