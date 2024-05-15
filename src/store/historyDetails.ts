import { IHistoryItem } from "@/app/api/generate-bio/route";
import { create } from "zustand";

interface IHistoryStore {
	selectedHistoryItem: IHistoryItem | undefined;
	isDialogueOpen: boolean;
	setSelectedHistoryItem: (item: IHistoryItem) => void;
	setIsDialogueOpen: (isDialogueOpen: boolean) => void;
}

export const useHistoryDetails = create<IHistoryStore>((set) => ({
	selectedHistoryItem: undefined,
	isDialogueOpen: false,
	setIsDialogueOpen: (isDialogueOpen: boolean) => set({ isDialogueOpen }),
	setSelectedHistoryItem: (item: IHistoryItem) =>
		set({ selectedHistoryItem: item }),
}));
