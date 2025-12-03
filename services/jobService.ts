import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences, Job, AgentPlan, NotificationPlatform } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Performs a two-step job search:
 * 1. Uses Gemini with Google Search Tool to find live listings.
 * 2. Uses Gemini (JSON mode) to structure the search results into UI-friendly data.
 */
export const searchJobsWithAI = async (prefs: UserPreferences): Promise<Job[]> => {
  try {
    const modelId = "gemini-2.5-flash"; 

    // --- STEP 1: WEB SEARCH (Grounding) ---
    const searchPrompt = `
      Actúa como un headhunter experto en Perú.
      Objetivo: Encontrar EXACTAMENTE 10 ofertas de trabajo para este perfil.
      
      Perfil del candidato:
      - Rol: ${prefs.career || prefs.sectorSub}
      - Habilidades: ${prefs.skills.join(", ")}
      - Ubicación: ${prefs.locationDist}, ${prefs.locationDept}
      
      Instrucciones de búsqueda:
      1. Busca exhaustivamente en LinkedIn, Computrabajo, Bumeran, GetOnBoard.
      2. FECHA: Prioriza ofertas de "HOY" o "AYER". Si no encuentras 10 recientes, completa la lista con ofertas de esta semana.
      3. CANTIDAD: Debes encontrar suficiente información para listar 10 puestos distintos.
      4. REQUISITO: Obtén los enlaces para postular.
    `;

    // Primera llamada: Obtener información cruda de internet con URLs
    const searchResponse = await ai.models.generateContent({
      model: modelId,
      contents: searchPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const rawText = searchResponse.text || "";
    
    // Extraer URLs reales del metadata de grounding
    // @ts-ignore
    const chunks = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .map((chunk: any) => {
        if (chunk.web) {
          return { title: chunk.web.title || 'Fuente Web', uri: chunk.web.uri || '#' };
        }
        return null;
      })
      .filter((s: any) => s !== null);

    // --- STEP 2: STRUCTURED EXTRACTION (JSON) ---
    const extractionPrompt = `
      Analiza el texto de búsqueda y las fuentes.
      Tu tarea es generar un JSON con UNA LISTA DE 10 OFERTAS DE TRABAJO.
      
      FUENTES DETECTADAS:
      ${JSON.stringify(sources, null, 2)}
      
      TEXTO:
      ${rawText}
      
      Instrucciones Críticas:
      1. DEBES devolver un array con 10 objetos (ni 4, ni 6... QUIERO 10).
      2. Si el texto original encontró menos de 10, usa tu conocimiento general sobre empresas en Perú que suelen contratar ${prefs.career} para completar la lista hasta llegar a 10 (marcándolos con fecha estimada).
      3. Mapea URLs reales si existen en las fuentes. Si no, usa null.
      4. Genera una descripción atractiva para cada uno.
      
      Formato JSON esperado: Array de objetos Job.
    `;

    const structureResponse = await ai.models.generateContent({
      model: modelId,
      contents: extractionPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              company: { type: Type.STRING },
              salary: { type: Type.STRING },
              type: { type: Type.STRING },
              location: { type: Type.STRING },
              logo: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              isNew: { type: Type.BOOLEAN },
              url: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["title", "company", "location", "description"]
          },
        },
      },
    });

    const jobsText = structureResponse.text;
    if (!jobsText) return [];

    let jobs: Job[] = JSON.parse(jobsText);

    // Post-proceso final
    jobs = jobs.map((job, index) => ({
      ...job,
      id: `ai-job-${Date.now()}-${index}`,
      logo: job.logo || `https://picsum.photos/seed/${job.company.replace(/\s/g, '')}/50/50`,
      url: job.url || `https://www.google.com/search?q=trabajo+${job.title}+${job.company}`,
      isNew: index < 5, // Marcamos solo los primeros 5 como "Nuevos" visualmente
      tags: job.tags || [prefs.modality, "Reciente"]
    }));

    return jobs;

  } catch (error) {
    console.error("Error searching jobs with AI:", error);
    return [];
  }
};

/**
 * Analyzes a resume (simulated from preferences) against a specific job description.
 */
export const analyzeMatch = async (job: Job, prefs: UserPreferences): Promise<string> => {
  try {
    const resumeText = `
      Candidato: Estudiante de ${prefs.career}
      Experiencia: ${prefs.experience}
      Habilidades Técnicas: ${prefs.skills.join(", ")}
      Interés: Sector ${prefs.sectorGeneral} - ${prefs.sectorSub}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Actúa como un coach de carrera senior.
        Analiza la compatibilidad entre este perfil y la oferta:
        
        OFERTA: ${job.title} en ${job.company}
        DESC: ${job.description}
        
        PERFIL: ${resumeText}
        
        Output Markdown conciso:
        1. **% Match**: (0-100%).
        2. **Puntos Fuertes**: 2 bullets.
        3. **Gap**: 1 punto a mejorar.
        4. **Tip**: Consejo rápido.
      `,
    });
    return response.text || "No se pudo generar el análisis.";
  } catch (error) {
    console.error("Error analyzing match:", error);
    return "Error al conectar con el servicio de análisis.";
  }
};

export const createAutomationAgent = async (prefs: UserPreferences, platform: NotificationPlatform): Promise<AgentPlan> => {
  try {
    const prompt = `Configura agente búsqueda empleo para ${prefs.career} en ${prefs.locationDist}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            agentName: { type: Type.STRING },
            searchFrequency: { type: Type.STRING },
            optimizedQueries: { type: Type.ARRAY, items: { type: Type.STRING } },
            estimatedMatchesPerWeek: { type: Type.INTEGER }
          },
          required: ["agentName", "searchFrequency", "optimizedQueries", "estimatedMatchesPerWeek"]
        }
      }
    });

    return JSON.parse(response.text || "{}") as AgentPlan;
  } catch (error) {
    return {
      agentName: "JobBot Alpha",
      searchFrequency: "Diariamente 9AM",
      optimizedQueries: ["empleos recientes"],
      estimatedMatchesPerWeek: 5
    };
  }
};