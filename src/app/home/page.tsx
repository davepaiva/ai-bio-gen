"use client";
import AiPromptForm from "@/components/molecules/AiPromptForm";
import HistoryDialogue from "@/components/molecules/HistoryDialogue";
import HistoryList from "@/components/molecules/HistoryList";
import { useHistoryDetails } from "@/store/historyDetails";
import { useGetUserHistory } from "@/store/historyList";
import { useUserStore } from "@/store/user";
import { getHistory } from "@/utils/apiClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HomePage = () => {
	const user = useUserStore((state) => state.user);
	const router = useRouter();
	const { setHistoryList, historyList } = useGetUserHistory();
	const { selectedHistoryItem, isDialogueOpen, setIsDialogueOpen } =
		useHistoryDetails();

	console.log("historyList0: ", historyList);

	useEffect(() => {
		const fetchHistory = async () => {
			const history = await getHistory();
			setHistoryList(history.data);
		};
		fetchHistory();
	}, []);

	useEffect(() => {
		if (!user) {
			router.push("/");
		}
	}, [user, router]);

	return (
		<>
			<div className="flex">
				<div className="hidden flex-5 lg:block">
					<HistoryList />
				</div>
				<div className="flex-1 pl-[8px]">
					<AiPromptForm />
				</div>
			</div>
			<HistoryDialogue
				open={isDialogueOpen}
				onOpenChange={setIsDialogueOpen}
				historyItem={selectedHistoryItem}
			/>
		</>
	);
};

export default HomePage;
