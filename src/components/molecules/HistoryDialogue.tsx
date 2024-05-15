import { IHistoryItem } from "@/app/api/generate-bio/route";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

const HistoryDialogue = ({
	open,
	onOpenChange,
	historyItem,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	historyItem?: IHistoryItem;
}) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="flex flex-col gap-4">
				<div>
					<h1 className="text-2xl">Input</h1>
					<p className="text-sm">{historyItem?.input_text}</p>
					<p className="text-sm">{`Temperature: ${historyItem?.temperature}`}</p>
				</div>
				<div>
					<h1 className="text-2xl">Output</h1>
					<p className="text-sm">{historyItem?.bio}</p>
					<p className="text-sm">
						{historyItem?.generated_usernames.join(", ")}
					</p>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default HistoryDialogue;
