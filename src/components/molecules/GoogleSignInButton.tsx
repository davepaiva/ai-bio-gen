import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/utils/firebase";
import { useToast } from "@/components/ui/use-toast";
import { FirebaseError } from "firebase/app";
import { useUserStore } from "@/store/user";
import { apiClient, getAccessToken } from "@/utils/apiClient";
import { useRouter } from "next/navigation";

const GoogleSignInButton = ({ className }: { className: string }) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const { toast } = useToast();

	const signInWithGoogle = async () => {
		try {
			setIsLoading(true);
			const result = await signInWithPopup(auth, provider);
			const user = result.user;
			const response = await getAccessToken({
				name: user.displayName || "",
				email: user.email || "",
				profile_pic_url: user.photoURL || "",
			});
			if (response) {
				router.replace("/home");
			}
		} catch (error) {
			const err = error as FirebaseError;
			if (err.code === "auth/popup-closed-by-user-action") {
				toast({
					title: "Sign in cancelled",
					description: "Sign in was cancelled by the user",
					variant: "destructive",
				});
				return;
			}
			toast({
				title: "Error signing in",
				description: "There was an error signing in",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<Button
			className={className}
			onClick={signInWithGoogle}
			isLoading={isLoading}
		>
			<FaGoogle className="mr-[4px]" />
			sign in
		</Button>
	);
};

export default GoogleSignInButton;
