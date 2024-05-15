import * as React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { useSheetStore } from "@/store/sheet";
import { useGetUserHistory } from "@/store/historyList";
import HistoryDialogue from "./HistoryDialogue";
import { IHistoryItem } from "@/app/api/generate-bio/route";

const HistoryList = () => {
	const { setIsSheetOpen } = useSheetStore();
	const { historyList } = useGetUserHistory();
	const [open, setOpen] = React.useState(false);
	const [historyItem, setHistoryItem] = React.useState<IHistoryItem>();

	console.log("historyList", historyList);

	const handleCloseSheet = React.useCallback(
		(index: number) => {
			setIsSheetOpen(false);
			setHistoryItem(historyList[index]);
			setOpen(true);
		},
		[setIsSheetOpen, historyList]
	);

	return (
		<div className="p-4 w-[200px]">
			<h4 className="mb-4 text-sm font-medium">History</h4>
			<ScrollArea className="z-10 " style={{ height: "70vh" }}>
				{historyList.map((item, index) => (
					<React.Fragment key={index}>
						<a
							onClick={() => handleCloseSheet(index)}
							className="py-[20px] text-sm"
						>
							{item.bio}
						</a>
						<Separator />
					</React.Fragment>
				))}
			</ScrollArea>
			<HistoryDialogue
				open={open}
				onOpenChange={setOpen}
				historyItem={historyItem}
			/>
		</div>
	);
};

export default HistoryList;
