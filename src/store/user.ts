import { create } from "zustand";

interface User {
	name: string;
	email: string;
	profile_pic_url: string;
}

interface IUserStore {
	user: any;
	setUser: (user: User) => void;
}

export const useUserStore = create<IUserStore>((set) => ({
	user: null,
	setUser: (user: User) => set({ user }),
}));
