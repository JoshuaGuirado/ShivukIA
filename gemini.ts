
import { GoogleGenAI, Type } from "@google/genai";

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface GeneratedContent {
  title: string;
  content: string;
  hashtags: string;
  imagePrompt: string;
  generatedImageUrl?: string;
  sources?: GroundingSource[];
}

/**
 * Helper para tratar erros da API do Gemini/Veo
 */
function handleGeminiError(error: any): never {
  console.error("Gemini API Error Detail:", error);

  // Tenta extrair código de status ou mensagem de erro
  const code = error.status || error.code || error.error?.code;
  const message = error.message || error.error?.message || JSON.stringify(error);

  if (code === 429 || message.includes('429') || message.includes('RESOURCE_EXHAUSTED') || message.includes('quota')) {
    throw new Error("Limite de cota da API excedido (429). O plano gratuito ou atual atingiu o limite de requisições. Verifique o Google AI Studio.");
  }

  if (message.includes('API key')) {
    throw new Error("Erro de API Key. Verifique se a chave está configurada e válida.");
  }

  throw new Error(`Erro na IA: ${message.substring(0, 150)}${message.length > 150 ? '...' : ''}`);
}

/**
 * Shivuk AI 2.0 - Engine de Geração de Alta Performance
 */
export async function generatePostContent(prompt: string, imageBase64?: string | null): Promise<GeneratedContent> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("API Key não configurada no ambiente.");

  const ai = new GoogleGenAI({ apiKey });

  try {
    const parts: any[] = [];

    if (imageBase64) {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const mimeType = imageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || "image/png";

      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      });
      prompt = `ANALISE A IMAGEM FORNECIDA. Baseado nela e no seguinte contexto, crie o conteúdo: ${prompt}`;
    }

    const systemInstruction = `
        Você é o Shivuk AI 2.0, Diretor de Criação Senior.
        Missão: Criar um post de alta conversão (Legenda + Prompt de Imagem).
        CONTEXTO: ${prompt}
        REGRAS: Idioma PT-BR. 'imagePrompt' em INGLÊS.
    `;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        content: { type: Type.STRING },
        hashtags: { type: Type.STRING },
        imagePrompt: { type: Type.STRING },
      },
      required: ["title", "content", "hashtags", "imagePrompt"],
    };

    parts.push({ text: systemInstruction });

    const textResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        tools: [{ googleSearch: {} }]
      },
    });

    const data = JSON.parse(textResponse.text || "{}");

    // Extração de fontes
    const sources: GroundingSource[] = [];
    const groundingChunks = textResponse.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }

    // Geração da Arte Visual
    const imageResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{
        text: `High-end commercial photography background, minimal, text-space friendly, luxury style: ${data.imagePrompt}. 8k, photorealistic.`
      }],
      config: {
        imageConfig: { aspectRatio: "4:5" }
      }
    });

    let generatedImageUrl = "";
    if (imageResponse.candidates?.[0]?.content?.parts) {
      for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          generatedImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    return {
      title: data.title || "Post Shivuk AI",
      content: data.content || "Erro ao gerar texto.",
      hashtags: data.hashtags || "",
      imagePrompt: data.imagePrompt || "",
      generatedImageUrl,
      sources: sources.length > 0 ? sources : undefined
    };

  } catch (error) {
    handleGeminiError(error);
  }
}

export async function generateImageCaption(imageBase64: string, context?: string): Promise<GeneratedContent> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("API Key required");
  const ai = new GoogleGenAI({ apiKey });

  try {
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const mimeType = imageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || "image/png";
    const prompt = `Analise esta imagem. Crie legenda para Instagram/LinkedIn. PT-BR. ${context || ''}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: [{ inlineData: { data: base64Data, mimeType: mimeType } }, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            hashtags: { type: Type.STRING },
            imagePrompt: { type: Type.STRING },
          },
          required: ["title", "content", "hashtags", "imagePrompt"],
        },
      }
    });

    const data = JSON.parse(response.text || "{}");
    return {
      title: data.title || "Legenda Gerada",
      content: data.content || "Legenda não disponível.",
      hashtags: data.hashtags || "",
      imagePrompt: data.imagePrompt || "Imagem original",
      generatedImageUrl: imageBase64,
      sources: undefined
    };
  } catch (error) {
    handleGeminiError(error);
  }
}

export async function editImage(imageBase64: string, prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("API Key required");
  const ai = new GoogleGenAI({ apiKey });

  try {
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const mimeType = imageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || "image/png";
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType: mimeType } },
          { text: prompt },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Não foi possível editar a imagem.");
  } catch (error) {
    handleGeminiError(error);
  }
}

export async function generateVideoCaption(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return "API Key necessária.";
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [`Crie legenda para vídeo: "${prompt}". PT-BR. Com emojis e CTA.`]
    });
    return response.text || "Legenda não gerada.";
  } catch (error) { return "Erro na legenda."; }
}

export async function generateVeoVideo(prompt: string, imageBase64?: string | null): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("API Key required");
  const ai = new GoogleGenAI({ apiKey });

  try {
    let requestParams: any = {
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Cinematic, high quality: ${prompt}`,
      config: { numberOfVideos: 1, resolution: '1080p', aspectRatio: '16:9' }
    };

    if (imageBase64) {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const mimeType = imageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || "image/png";
      requestParams.image = { imageBytes: base64Data, mimeType: mimeType };
    }

    let operation = await ai.models.generateVideos(requestParams);

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("Video generation failed");

    const separator = videoUri.includes('?') ? '&' : '?';
    const finalUrl = `${videoUri}${separator}key=${apiKey}`;
    const videoResponse = await fetch(finalUrl);
    if (!videoResponse.ok) throw new Error("Failed to fetch video");
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
  } catch (error) {
    handleGeminiError(error);
  }
}
