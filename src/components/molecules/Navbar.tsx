"use client";

import * as React from "react";
import { Button } from "../ui/button";
import { useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";
import { MdOutlineHistory } from "react-icons/md";
import { useSheetStore } from "@/store/sheet";
import SideDrawer from "./SideDrawer";

const Navbar: React.FC = () => {
	const user = useUserStore((state) => state.user);
	const { isSheetOpen, setIsSheetOpen } = useSheetStore();
	const router = useRouter();

	const handleLogout = () => {
		useUserStore.setState({ user: null });
		localStorage.removeItem("access_token");
		localStorage.removeItem("user");
		router.push("/");
	};

	const handleToggleSheet = () => {
		setIsSheetOpen(true);
	};

	return (
		<>
			<nav className=" absolute top-0 left-0 right-0 bg-white shadow-lg p-4 sticky">
				<div className="flex justify-between items-center">
					<a href="#" className="flex items-center">
						<span className="font-semibold text-gray-950 text-xl">
							AI Bio Generator
						</span>
					</a>
					<div className="flex flex-row items-center">
						<div className="lg:hidden mr-2">
							<Button variant={"outline"} onClick={handleToggleSheet}>
								<MdOutlineHistory className="mr-[4px]" /> View history
							</Button>
						</div>
						{!!user && (
							<Button variant={"secondary"} onClick={handleLogout}>
								Logout
							</Button>
						)}
					</div>
				</div>
			</nav>
			<SideDrawer />
		</>
	);
};

export default Navbar;
