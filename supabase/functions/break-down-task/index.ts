import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { task, quadrant } = await req.json();
    
    if (!task) {
      return new Response(
        JSON.stringify({ error: "La tâche est requise" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Configuration manquante" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Map quadrant to French descriptions
    const quadrantDescriptions: Record<string, string> = {
      "urgent-important": "Urgent & Important (À FAIRE IMMÉDIATEMENT)",
      "important": "Important mais Non Urgent (À PLANIFIER)",
      "urgent": "Urgent mais Non Important (À DÉLÉGUER)",
      "neither": "Ni Urgent Ni Important (À ÉLIMINER)",
    };

    const quadrantContext = quadrantDescriptions[quadrant] || "";

    const systemPrompt = `Tu es un assistant spécialisé dans la gestion de projet et la décomposition de tâches.
Ton rôle est d'analyser une tâche et de la décomposer en sous-tâches claires, actionnables et de taille raisonnable.

RÈGLES IMPORTANTES :
- Retourne TOUJOURS entre 2 et 5 sous-tâches maximum
- Chaque sous-tâche doit être claire, spécifique et actionnable
- Les sous-tâches doivent être ordonnées logiquement
- Garde le même niveau de priorité que la tâche principale
- Sois concis mais précis
- Ne décompose que si la tâche est assez complexe (sinon retourne une seule sous-tâche identique)

Le quadrant actuel est : ${quadrantContext}`;

    const userPrompt = `Analyse cette tâche et décompose-la en sous-tâches si nécessaire :

"${task}"

Si la tâche est simple et ne nécessite pas de décomposition, retourne une seule sous-tâche identique à la tâche principale.
Si la tâche est complexe, décompose-la en 2 à 5 sous-tâches claires et actionnables.`;

    console.log("Calling Lovable AI with task:", task);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_subtasks",
              description: "Retourner la liste des sous-tâches décomposées",
              parameters: {
                type: "object",
                properties: {
                  subtasks: {
                    type: "array",
                    description: "Liste des sous-tâches (2-5 maximum)",
                    items: {
                      type: "object",
                      properties: {
                        text: {
                          type: "string",
                          description: "Description claire et concise de la sous-tâche"
                        },
                        order: {
                          type: "number",
                          description: "Ordre d'exécution logique (1, 2, 3...)"
                        }
                      },
                      required: ["text", "order"],
                      additionalProperties: false
                    },
                    minItems: 1,
                    maxItems: 5
                  },
                  reasoning: {
                    type: "string",
                    description: "Courte explication du découpage (optionnel)"
                  }
                },
                required: ["subtasks"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "return_subtasks" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Trop de requêtes. Veuillez réessayer dans quelques instants." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits épuisés. Veuillez recharger votre compte Lovable AI." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Erreur lors de l'appel à l'IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("AI response:", JSON.stringify(data));

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error("No tool call in response");
      return new Response(
        JSON.stringify({ error: "Réponse invalide de l'IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = JSON.parse(toolCall.function.arguments);
    const subtasks = result.subtasks || [];

    // Sort by order and extract text
    const orderedSubtasks = subtasks
      .sort((a: any, b: any) => a.order - b.order)
      .map((st: any) => st.text);

    console.log("Returning subtasks:", orderedSubtasks);

    return new Response(
      JSON.stringify({ 
        subtasks: orderedSubtasks,
        reasoning: result.reasoning
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in break-down-task function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
