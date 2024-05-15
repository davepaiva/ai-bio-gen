import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import HistoryList from "./HistoryList";
import { useSheetStore } from "@/store/sheet";

const SideDrawer = () => {
	const { isSheetOpen, setIsSheetOpen } = useSheetStore();

	return (
		<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
			<SheetContent side={"left"}>
				<HistoryList />
			</SheetContent>
		</Sheet>
	);
};

export default SideDrawer;
