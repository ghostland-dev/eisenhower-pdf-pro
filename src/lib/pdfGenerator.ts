import jsPDF from "jspdf";
import { Task, QuadrantType } from "@/types/task";

const QUADRANT_CONFIGS = {
  "urgent-important": {
    title: "Urgent & Important",
    description: "À FAIRE IMMÉDIATEMENT",
  },
  important: {
    title: "Important mais Non Urgent",
    description: "À PLANIFIER",
  },
  urgent: {
    title: "Urgent mais Non Important",
    description: "À DÉLÉGUER",
  },
  neither: {
    title: "Ni Urgent Ni Important",
    description: "À ÉLIMINER",
  },
} as const;

export const generatePDF = (tasks: Task[]): void => {
  try {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Title
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("Matrice d'Eisenhower", pageWidth / 2, yPosition, { align: "center" });
    
    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, pageWidth / 2, yPosition, { align: "center" });
    
    yPosition += 15;

    // Group tasks by quadrant
    const tasksByQuadrant = tasks.reduce((acc, task) => {
      if (!acc[task.quadrant]) {
        acc[task.quadrant] = [];
      }
      acc[task.quadrant].push(task);
      return acc;
    }, {} as Record<QuadrantType, Task[]>);

    // Render each quadrant
    const quadrants: QuadrantType[] = ["urgent-important", "important", "urgent", "neither"];
    
    quadrants.forEach((quadrant) => {
      const config = QUADRANT_CONFIGS[quadrant];
      const quadrantTasks = tasksByQuadrant[quadrant] || [];

      // Check if we need a new page
      if (yPosition > pdf.internal.pageSize.getHeight() - 60) {
        pdf.addPage();
        yPosition = margin;
      }

      // Quadrant header
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(config.title, margin, yPosition);
      
      yPosition += 6;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "italic");
      pdf.text(config.description, margin, yPosition);
      
      yPosition += 8;

      // Tasks
      if (quadrantTasks.length === 0) {
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(150, 150, 150);
        pdf.text("Aucune tâche", margin + 5, yPosition);
        pdf.setTextColor(0, 0, 0);
        yPosition += 6;
      } else {
        pdf.setFont("helvetica", "normal");
        quadrantTasks.forEach((task, index) => {
          const taskText = `${index + 1}. ${task.text}`;
          const splitText = pdf.splitTextToSize(taskText, pageWidth - 2 * margin - 10);
          
          // Check if we need a new page
          if (yPosition + (splitText.length * 5) > pdf.internal.pageSize.getHeight() - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          
          pdf.text(splitText, margin + 5, yPosition);
          yPosition += splitText.length * 5 + 2;
        });
      }

      yPosition += 8;
    });

    // Save the PDF
    const fileName = `matrice-eisenhower-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    throw new Error("Erreur lors de la génération du PDF");
  }
};
