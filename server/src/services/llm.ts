type Slide = {
  title: string;
  subtitle?: string;
  bullets: string[];
};

type Input = {
  topic: string;
  slideCount: number;
  profileNiche: string;
  tone: string;
};

function mockSlides(slideCount: number, topic: string): Slide[] {
  const base: Slide[] = [];
  for (let i = 1; i <= slideCount; i++) {
    base.push({
      title: i === 1 ? "O fato mais bizarro da história" : `Ponto ${i}`,
      subtitle: i === 1 ? topic : undefined,
      bullets: [
        "Explique em 1 frase simples.",
        "Dê um detalhe que prende atenção.",
        "Feche com uma frase curta (efeito “caraca”).",
      ],
    });
  }
  return base;
}

export async function generateSlidesWithLLM(input: Input): Promise<Slide[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  if (!apiKey) {
    return mockSlides(input.slideCount, input.topic);
  }

  const system = `
Você é uma IA que escreve conteúdo para carrossel do Instagram.
Regras:
- Gere EXATAMENTE ${input.slideCount} slides.
- Conteúdo bem explicativo, frases curtas, alta retenção.
- Cada slide tem: title, optional subtitle, bullets (3 a 5).
- Linguagem em PT-BR, tom: ${input.tone}.
- Nicho do perfil: ${input.profileNiche}.
- Não use emojis.
- Não faça texto longo; bullets devem caber em card.
Retorne SOMENTE JSON válido no formato:
{ "slides": [ { "title": "...", "subtitle": "...", "bullets": ["..."] } ] }
  `.trim();

  const user = `Tema do carrossel: ${input.topic}`;

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.6,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text);
  }

  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) throw new Error("Resposta vazia da IA");

  // Parse robusto
  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch {
    // tenta extrair JSON se vier com lixo
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("IA não retornou JSON válido");
    parsed = JSON.parse(match[0]);
  }

  if (!parsed?.slides || !Array.isArray(parsed.slides)) {
    throw new Error("Formato inválido: esperado { slides: [...] }");
  }

  return parsed.slides;
}
