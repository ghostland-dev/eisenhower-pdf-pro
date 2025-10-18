import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { QuadrantType } from "@/types/task";
import { taskSchema } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";

interface TaskInputProps {
  onAddTask: (text: string, quadrant: QuadrantType) => void;
}

export const TaskInput = ({ onAddTask }: TaskInputProps) => {
  const [taskText, setTaskText] = useState("");
  const [selectedQuadrant, setSelectedQuadrant] = useState<QuadrantType>("urgent-important");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = taskSchema.safeParse({ text: taskText });

    if (!validation.success) {
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: validation.error.errors[0].message,
      });
      return;
    }

    onAddTask(validation.data.text, selectedQuadrant);
    setTaskText("");
    
    toast({
      title: "Tâche ajoutée",
      description: "Votre tâche a été ajoutée avec succès",
    });
  };

  const charCount = taskText.length;
  const showCharCount = charCount >= 450;

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="task-input">Nouvelle tâche</Label>
            <Input
              id="task-input"
              type="text"
              placeholder="Entrez votre tâche..."
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              className="w-full"
              maxLength={500}
              aria-label="Champ de saisie de tâche"
            />
            {showCharCount && (
              <p className="text-xs text-muted-foreground text-right">
                {charCount}/500 caractères
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quadrant-select">Catégorie</Label>
            <Select
              value={selectedQuadrant}
              onValueChange={(value) => setSelectedQuadrant(value as QuadrantType)}
            >
              <SelectTrigger id="quadrant-select" className="w-full" aria-label="Sélection de catégorie">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border z-50">
                <SelectItem value="urgent-important">
                  <span className="font-medium">Urgent & Important</span>
                </SelectItem>
                <SelectItem value="important">
                  <span className="font-medium">Important</span>
                </SelectItem>
                <SelectItem value="urgent">
                  <span className="font-medium">Urgent</span>
                </SelectItem>
                <SelectItem value="neither">
                  <span className="font-medium">Ni Urgent Ni Important</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!taskText.trim()}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter la tâche
        </Button>
      </div>
    </form>
  );
};
