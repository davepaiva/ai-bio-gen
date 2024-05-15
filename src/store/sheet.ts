import { create } from "zustand";

interface IUserStore {
	isSheetOpen: boolean;
	setIsSheetOpen: (isSheetOpen: boolean) => void;
}

export const useSheetStore = create<IUserStore>((set) => ({
	isSheetOpen: false,
	setIsSheetOpen: (isSheetOpen: boolean) => set({ isSheetOpen }),
}));
