"use client";

import * as React from "react";
import { Button } from "../ui/button";
import { useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
	const user = useUserStore((state) => state.user);
	const router = useRouter();

	const handleLogout = () => {
		useUserStore.setState({ user: null });
		localStorage.removeItem("access_token");
		localStorage.removeItem("user");
		router.push("/");
	};

	return (
		<nav className=" absolute top-0 left-0 right-0 bg-white shadow-lg p-4 sticky">
			<div className="flex justify-between items-center">
				<a href="#" className="flex items-center">
					<span className="font-semibold text-gray-950 text-xl">
						AI Bio Generator
					</span>
				</a>
				{!!user && <Button onClick={handleLogout}>Logout</Button>}
			</div>
		</nav>
	);
};

export default Navbar;
