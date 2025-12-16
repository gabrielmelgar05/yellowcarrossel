import { Router } from "express";
import { z } from "zod";
import { generateSlidesWithLLM } from "../services/llm";

export const generateRouter = Router();

const bodySchema = z.object({
  topic: z.string().min(8),
  slideCount: z.number().min(3).max(9),
  profileNiche: z.string().optional().default("geral"),
  tone: z.string().optional().default("informativo e direto"),
});

generateRouter.post("/generate-carousel", async (req, res) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { topic, slideCount, profileNiche, tone } = parsed.data;

  try {
    const slides = await generateSlidesWithLLM({
      topic,
      slideCount,
      profileNiche,
      tone,
    });

    return res.json({ slides });
  } catch (err: any) {
    return res.status(500).json({
      error: "Falha ao gerar carrossel",
      detail: err?.message || String(err),
    });
  }
});
