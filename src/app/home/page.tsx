"use client";
import AiPromptForm from "@/components/molecules/AiPromptForm";
import HistoryList from "@/components/molecules/HistoryList";
import { useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HomePage = () => {
	const user = useUserStore((state) => state.user);
	const router = useRouter();
	useEffect(() => {
		if (!user) {
			router.push("/");
		}
	}, [user, router]);

	return (
		<div className="flex">
			<div className="hidden  flex-5 lg:block">
				<HistoryList />
			</div>
			<div className="flex-1 pl-[8px]">
				<AiPromptForm />
			</div>
		</div>
	);
};

export default HomePage;
