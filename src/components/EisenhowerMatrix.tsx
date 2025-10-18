import { useState, useEffect } from "react";
import { Task, QuadrantType } from "@/types/task";
import { QuadrantCard } from "./QuadrantCard";
import { TaskInput } from "./TaskInput";
import { Button } from "@/components/ui/button";
import { Download, Save, Trash2 } from "lucide-react";
import { generatePDF } from "@/lib/pdfGenerator";
import { saveTasks, loadTasks } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export const EisenhowerMatrix = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Load tasks on mount
  useEffect(() => {
    const loadedTasks = loadTasks();
    setTasks(loadedTasks);
  }, []);

  // Auto-save on tasks change
  useEffect(() => {
    if (tasks.length > 0 || loadTasks().length > 0) {
      saveTasks(tasks);
    }
  }, [tasks]);

  const addTask = (text: string, quadrant: QuadrantType) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: text.trim(),
      quadrant,
      createdAt: new Date(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    toast({
      title: "Tâche supprimée",
      description: "La tâche a été supprimée avec succès",
    });
  };

  const clearAllTasks = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer toutes les tâches ?")) {
      setTasks([]);
      toast({
        title: "Tâches supprimées",
        description: "Toutes les tâches ont été supprimées",
      });
    }
  };

  const handleExportPDF = async () => {
    if (tasks.length === 0) {
      toast({
        variant: "destructive",
        title: "Aucune tâche",
        description: "Ajoutez des tâches avant d'exporter le PDF",
      });
      return;
    }

    try {
      setIsGenerating(true);
      generatePDF(tasks);
      toast({
        title: "PDF généré",
        description: "Votre matrice a été exportée avec succès",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer le PDF",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualSave = () => {
    saveTasks(tasks);
    toast({
      title: "Sauvegarde effectuée",
      description: "Vos tâches ont été sauvegardées",
    });
  };

  const getTasksByQuadrant = (quadrant: QuadrantType) => {
    return tasks.filter((task) => task.quadrant === quadrant);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Matrice d'Eisenhower
          </h1>
          <p className="text-muted-foreground text-lg">
            Organisez vos tâches selon leur urgence et importance
          </p>
        </header>

        {/* Task Input */}
        <TaskInput onAddTask={addTask} />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={handleManualSave} variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
          <Button
            onClick={handleExportPDF}
            disabled={isGenerating || tasks.length === 0}
            className="bg-primary hover:bg-primary/90"
          >
            <Download className="w-4 h-4 mr-2" />
            {isGenerating ? "Génération..." : "Exporter en PDF"}
          </Button>
          <Button
            onClick={clearAllTasks}
            variant="destructive"
            disabled={tasks.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Tout supprimer
          </Button>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuadrantCard
            title="Urgent & Important"
            description="À FAIRE IMMÉDIATEMENT"
            tasks={getTasksByQuadrant("urgent-important")}
            onDeleteTask={deleteTask}
            className="border-2 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-300 dark:border-green-700"
          />
          <QuadrantCard
            title="Important mais Non Urgent"
            description="À PLANIFIER"
            tasks={getTasksByQuadrant("important")}
            onDeleteTask={deleteTask}
            className="border-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-300 dark:border-blue-700"
          />
          <QuadrantCard
            title="Urgent mais Non Important"
            description="À DÉLÉGUER"
            tasks={getTasksByQuadrant("urgent")}
            onDeleteTask={deleteTask}
            className="border-2 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-300 dark:border-orange-700"
          />
          <QuadrantCard
            title="Ni Urgent Ni Important"
            description="À ÉLIMINER"
            tasks={getTasksByQuadrant("neither")}
            onDeleteTask={deleteTask}
            className="border-2 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 border-pink-300 dark:border-pink-700"
          />
        </div>

        {/* Info Footer */}
        <footer className="text-center text-sm text-muted-foreground border-t border-border pt-6">
          <p>Vos tâches sont automatiquement sauvegardées dans votre navigateur</p>
        </footer>
      </div>
    </div>
  );
};
