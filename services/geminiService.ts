import { GoogleGenAI, Type } from "@google/genai";
import { RoomConfig, PlanAnalysis } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generates a detailed architectural analysis and a prompt for the image generator.
 */
export const generateArchitecturalAnalysis = async (config: RoomConfig): Promise<{ analysis: PlanAnalysis, imagePrompt: string }> => {
  const ai = getClient();
  
  const prompt = `
    Agis comme un architecte expert.
    Le client souhaite un plan de maison avec les caractéristiques suivantes :
    - ${config.bedrooms} chambres
    - ${config.bathrooms} salle(s) de bain
    - ${config.office ? '1 bureau' : 'Pas de bureau'}
    - ${config.laundry ? '1 buanderie' : 'Pas de buanderie'}
    - ${config.separateWc ? '1 WC indépendant' : 'WC dans la salle de bain'}
    - Cuisine ${config.openKitchen ? 'ouverte sur le séjour (américaine)' : 'fermée'}
    - ${config.garage ? 'Avec garage' : 'Sans garage'}
    - Style architectural : ${config.style}

    Tâche 1 : Fournis une analyse détaillée en JSON avec des suggestions de surfaces pour chaque pièce, une estimation de la surface totale, et des conseils de construction.
    Tâche 2 : Crée un prompt descriptif très précis en ANGLAIS pour un générateur d'images IA afin de créer une vue de dessus (2D Floor Plan) propre et professionnelle de cette maison.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING, description: "Résumé global du projet en français." },
              surfaceSuggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    room: { type: Type.STRING },
                    area: { type: Type.STRING, description: "Surface conseillée (ex: 12m²)" },
                    tips: { type: Type.STRING, description: "Conseil d'aménagement court" }
                  }
                }
              },
              estimatedTotalArea: { type: Type.STRING, description: "Surface totale estimée" },
              constructionTips: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          imagePrompt: { type: Type.STRING, description: "Le prompt en ANGLAIS optimisé pour générer l'image du plan." }
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("Aucune réponse de l'IA.");
  }

  return JSON.parse(response.text);
};

/**
 * Generates the floor plan image using the specialized model.
 */
export const generateFloorPlanImage = async (imagePrompt: string): Promise<string> => {
  const ai = getClient();

  // Enforce specific visual style keywords to ensure it looks like a plan
  const finalPrompt = `
    Professional architectural 2D floor plan, top-down view. 
    White background, clean black lines, blueprint style but modern.
    Shows furniture layout lightly. High contrast.
    ${imagePrompt}
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image', // Switched to flash-image to avoid permission errors
        contents: {
            parts: [{ text: finalPrompt }]
        },
        config: {
            imageConfig: {
                aspectRatio: "4:3",
                // imageSize is not supported on gemini-2.5-flash-image
            }
        }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData && part.inlineData.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    throw new Error("Aucune image générée.");
  } catch (error) {
      console.error("Image generation failed", error);
      throw error;
  }
};