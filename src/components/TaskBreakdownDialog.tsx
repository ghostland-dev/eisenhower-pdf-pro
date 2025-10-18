import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles, Loader2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { QuadrantType } from "@/types/task";

interface TaskBreakdownDialogProps {
  taskText: string;
  quadrant: QuadrantType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubtasksSelected: (subtasks: string[]) => void;
}

export const TaskBreakdownDialog = ({
  taskText,
  quadrant,
  open,
  onOpenChange,
  onSubtasksSelected,
}: TaskBreakdownDialogProps) => {
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [reasoning, setReasoning] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubtasks, setSelectedSubtasks] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const handleBreakdown = async () => {
    setIsLoading(true);
    setSubtasks([]);
    setReasoning("");
    setSelectedSubtasks(new Set());

    try {
      const { data, error } = await supabase.functions.invoke("break-down-task", {
        body: { task: taskText, quadrant },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setSubtasks(data.subtasks || []);
      setReasoning(data.reasoning || "");
      
      // Select all subtasks by default
      setSelectedSubtasks(new Set(data.subtasks.map((_: string, i: number) => i)));

      toast({
        title: "Tâche décomposée",
        description: `${data.subtasks.length} sous-tâche(s) générée(s)`,
      });
    } catch (error) {
      console.error("Error breaking down task:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de décomposer la tâche",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSubtask = (index: number) => {
    const newSelected = new Set(selectedSubtasks);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedSubtasks(newSelected);
  };

  const handleAddSelected = () => {
    const selected = subtasks.filter((_, i) => selectedSubtasks.has(i));
    onSubtasksSelected(selected);
    onOpenChange(false);
    
    toast({
      title: "Sous-tâches ajoutées",
      description: `${selected.length} sous-tâche(s) ajoutée(s) avec succès`,
    });
  };

  // Auto-trigger breakdown when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (newOpen && subtasks.length === 0 && !isLoading) {
      handleBreakdown();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Découper la tâche en sous-tâches
          </DialogTitle>
          <DialogDescription>
            L'IA va analyser votre tâche et la décomposer en étapes plus petites
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Original Task */}
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Tâche originale :</h3>
            <p className="text-sm">{taskText}</p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Analyse en cours...</p>
            </div>
          )}

          {/* Subtasks */}
          {!isLoading && subtasks.length > 0 && (
            <>
              {reasoning && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <span className="font-semibold">💡 Analyse : </span>
                    {reasoning}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="font-semibold">
                  Sous-tâches suggérées ({subtasks.length}) :
                </h3>
                {subtasks.map((subtask, index) => (
                  <div
                    key={index}
                    onClick={() => toggleSubtask(index)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedSubtasks.has(index)
                        ? "bg-primary/10 border-primary"
                        : "bg-card border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                          selectedSubtasks.has(index)
                            ? "bg-primary border-primary"
                            : "border-border"
                        }`}
                      >
                        {selectedSubtasks.has(index) && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-semibold text-muted-foreground">
                          Étape {index + 1}
                        </span>
                        <p className="text-sm mt-1">{subtask}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleAddSelected}
                  disabled={selectedSubtasks.size === 0}
                  className="flex-1"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter les sous-tâches sélectionnées ({selectedSubtasks.size})
                </Button>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Annuler
                </Button>
              </div>
            </>
          )}

          {/* Retry Button */}
          {!isLoading && subtasks.length > 0 && (
            <Button
              variant="ghost"
              onClick={handleBreakdown}
              className="w-full"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Régénérer l'analyse
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
