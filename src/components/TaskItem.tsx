import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskItemProps {
  text: string;
  onDelete: () => void;
}

export const TaskItem = ({ text, onDelete }: TaskItemProps) => {
  return (
    <li className="group flex items-start gap-2 p-3 rounded-lg bg-card/50 hover:bg-card transition-colors border border-border/50">
      <span className="flex-1 text-sm leading-relaxed">{text}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 shrink-0"
        aria-label="Supprimer la tâche"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  );
};
