import { IHistoryItem } from "@/app/api/generate-bio/route";
import { create } from "zustand";

interface IHistoryStore {
	historyList: IHistoryItem[];
	setHistoryList: (historyList: IHistoryItem[]) => void;
	addHistoryItem: (item: IHistoryItem) => void;
}

export const useGetUserHistory = create<IHistoryStore>((set) => ({
	historyList: [],
	setHistoryList: (historyList: IHistoryItem[]) => set({ historyList }),
	addHistoryItem: (item: IHistoryItem) =>
		set((state) => ({ historyList: [item, ...state.historyList] })),
}));
