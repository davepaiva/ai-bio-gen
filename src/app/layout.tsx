import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/molecules/Navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "AI Bio Generator",
	description: "Spice up your social media game",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<html lang="en">
				<body className={inter.className}>
					<Navbar />
					<div className="py-[12px] px-[16px]">{children}</div>
					<Toaster />
				</body>
			</html>
		</>
	);
}
