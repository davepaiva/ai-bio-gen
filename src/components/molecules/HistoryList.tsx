import * as React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { List } from "react-virtualized";
import { useSheetStore } from "@/store/sheet";

const tags = Array.from({ length: 50 }).map(
	(_, i, a) => `v1.2.0-beta.${a.length - i}`
);

const HistoryList = () => {
	const { setIsSheetOpen } = useSheetStore();

	const handleCloseSheet = React.useCallback(
		(index: number) => {
			console.log(`Closing sheet for item at index ${index}`);
			setIsSheetOpen(false);
		},
		[setIsSheetOpen]
	);

	function rowRenderer({
		key, // Unique key within array of rows
		index, // Index of row within collection
	}: any) {
		const handleClick = () => {
			handleCloseSheet(index);
		};
		return (
			<>
				<a onClick={handleClick} className={`py-[20px] text-sm `} key={key}>
					{tags[index]}
				</a>
				<Separator />
			</>
		);
	}

	return (
		<div className="p-4">
			<h4 className="mb-4 text-sm font-medium">History</h4>
			<List
				style={{ height: "90vh" }}
				width={200}
				height={100}
				rowCount={tags.length}
				rowHeight={20}
				rowRenderer={rowRenderer}
			/>
			,
		</div>
	);
};

export default HistoryList;
