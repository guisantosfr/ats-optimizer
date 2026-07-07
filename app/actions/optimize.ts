"use server";

import { ai } from "@/lib/gemini";

export interface OptimizedLinkedinResult {
  metadata: {
    title: string;
    author: string;
    subject: string;
    keywords: string;
  };
  headline: string;
  summary: string;
  experience: {
    company: string;
    role: string;
    period: string;
    bullets: string[];
  }[];
  skills: string[];
  education: {
    institution: string;
    degree: string;
    period: string;
  }[];
}

export interface OptimizedGupyResult {
  aboutMe: string;
  experiences: {
    company: string;
    role: string;
    period: string;
    description: string;
  }[];
  skills: string;
  additionalInfo: string;
}

const linkedinSchema = {
  type: "object",
  properties: {
    metadata: {
      type: "object",
      properties: {
        title: { type: "string" },
        author: { type: "string" },
        subject: { type: "string" },
        keywords: { type: "string" }
      },
      required: ["title", "author", "subject", "keywords"]
    },
    headline: { type: "string" },
    summary: { type: "string" },
    experience: {
      type: "array",
      items: {
        type: "object",
        properties: {
          company: { type: "string" },
          role: { type: "string" },
          period: { type: "string" },
          bullets: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["company", "role", "period", "bullets"]
      }
    },
    skills: {
      type: "array",
      items: { type: "string" }
    },
    education: {
      type: "array",
      items: {
        type: "object",
        properties: {
          institution: { type: "string" },
          degree: { type: "string" },
          period: { type: "string" }
        },
        required: ["institution", "degree", "period"]
      }
    }
  },
  required: ["metadata", "headline", "summary", "experience", "skills", "education"]
};

const gupySchema = {
  type: "object",
  properties: {
    aboutMe: { type: "string" },
    experiences: {
      type: "array",
      items: {
        type: "object",
        properties: {
          company: { type: "string" },
          role: { type: "string" },
          period: { type: "string" },
          description: { type: "string" }
        },
        required: ["company", "role", "period", "description"]
      }
    },
    skills: { type: "string" },
    additionalInfo: { type: "string" }
  },
  required: ["aboutMe", "experiences", "skills", "additionalInfo"]
};

export async function optimizeForLinkedin(
  resumeText: string,
  jobDescription: string
): Promise<{ success: boolean; data?: OptimizedLinkedinResult; error?: string }> {
  if (!resumeText || !jobDescription) {
    return { success: false, error: "O currículo e a descrição da vaga são obrigatórios." };
  }

  try {
    const prompt = `
Você é um especialista em recrutamento e seleção (Tech Recruiter) e otimização de currículos para ATS.
Seu objetivo é analisar o currículo do candidato e a descrição da vaga fornecidos abaixo, e reescrever o currículo otimizando-o para passar nos filtros de ATS e atrair recrutadores no LinkedIn.

Currículo Atual:
${resumeText}

Descrição da Vaga:
${jobDescription}

Instruções importantes:
1. Adapte o currículo para destacar as experiências, competências e conquistas mais relevantes para a vaga.
2. Identifique as palavras-chave mais importantes da descrição da vaga e as insira de forma natural ao longo do texto.
3. Crie um 'headline' profissional e chamativo de uma linha (ex: "Desenvolvedor Frontend Sênior | React | Next.js | TypeScript").
4. Crie um resumo profissional ('summary') conciso e impactante na primeira pessoa do singular ou terceira pessoa.
5. Reescreva as experiências profissionais ('experience'), estruturando cada atividade com bullet points acionáveis, focados em resultados/conquistas quantificáveis (ex: "Aumentei a performance em 20% utilizando Next.js").
6. Extraia as principais competências ('skills') que combinam com a vaga.
7. Mantenha os dados de educação ('education') do candidato originais, mas adapte se necessário o período ou formatação.
8. Gere metadados adequados para o PDF:
   - title: Ex. "Curriculo_Otimizado_[Nome_do_Candidato]"
   - author: Nome do Candidato (extraia do currículo)
   - subject: Cargo almejado (ex: "Desenvolvedor React")
   - keywords: Lista de palavras-chave separadas por vírgula.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: linkedinSchema,
      },
    });

    if (!response.text) {
      throw new Error("Resposta da IA vazia.");
    }

    const data = JSON.parse(response.text) as OptimizedLinkedinResult;
    return { success: true, data };
  } catch (error: any) {
    console.error("Erro na action optimizeForLinkedin:", error);
    return { success: false, error: error.message || "Erro ao comunicar com a API do Gemini." };
  }
}

export async function optimizeForGupy(
  resumeText: string,
  jobDescription: string
): Promise<{ success: boolean; data?: OptimizedGupyResult; error?: string }> {
  if (!resumeText || !jobDescription) {
    return { success: false, error: "O currículo e a descrição da vaga são obrigatórios." };
  }

  try {
    const prompt = `
Você é um especialista em otimização de currículos para a plataforma Gupy.
A plataforma Gupy usa inteligência artificial (a IA 'Gaia') para ranquear os candidatos com base na aderência da descrição das experiências e competências com os requisitos da vaga.
Seu objetivo é reescrever e estruturar as informações do candidato para preenchimento direto nos campos da Gupy, maximizando a nota de aderência.

Currículo Atual:
${resumeText}

Descrição da Vaga:
${jobDescription}

Instruções importantes:
1. "Sobre você" ('aboutMe'): Escreva um texto focado em resultados, citando as tecnologias e competências exigidas pela vaga de forma estratégica. Deve ter cerca de 1 a 2 parágrafos.
2. "Experiências Profissionais" ('experiences'): Reescreva as atividades de cada empresa focando no que a vaga exige. Use bullet points claros, iniciando com verbos de ação no passado (ex: "Desenvolvi...", "Liderei..."). Destaque os termos técnicos que a IA da Gupy vai buscar. Mantenha os nomes das empresas e períodos originais do currículo.
3. "Competências" ('skills'): Liste as competências técnicas e comportamentais mais relevantes separadas por vírgula.
4. "Informações Adicionais" ('additionalInfo'): Destaque certificações, cursos e projetos do currículo que tenham sinergia com a vaga.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: gupySchema,
      },
    });

    if (!response.text) {
      throw new Error("Resposta da IA vazia.");
    }

    const data = JSON.parse(response.text) as OptimizedGupyResult;
    return { success: true, data };
  } catch (error: any) {
    console.error("Erro na action optimizeForGupy:", error);
    return { success: false, error: error.message || "Erro ao comunicar com a API do Gemini." };
  }
}
