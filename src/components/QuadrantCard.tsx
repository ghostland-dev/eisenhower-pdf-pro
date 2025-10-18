import { Task } from "@/types/task";
import { TaskItem } from "./TaskItem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface QuadrantCardProps {
  title: string;
  description: string;
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
  className?: string;
}

export const QuadrantCard = ({
  title,
  description,
  tasks,
  onDeleteTask,
  className,
}: QuadrantCardProps) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        <CardDescription className="text-xs font-semibold uppercase tracking-wide">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Aucune tâche</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                text={task.text}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
