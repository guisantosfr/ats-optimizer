"use server";

import { ai } from "@/lib/gemini";
import { Type } from "@google/genai";

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
  education: {
    institution: string;
    degree: string;
    period: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  thingsToRemove: {
    title: string;
    reason: string;
  }[];
  thingsToAdd: {
    title: string;
    reason: string;
  }[];
  scores: {
    geral: number;
    resumo: number;
    experiencia: number;
    habilidades: number;
    cursos: number;
  };
}

export interface OptimizedGupyResult {
  scores: {
    geral: number;
    experiencias: number;
    cursosCertificados: number;
    habilidades: number;
  };
  keywords: string[];
  experiences: {
    company: string;
    role: string;
    period: string;
    bullets: string[];
  }[];
  courses: {
    type: 'course' | 'certification' | 'acknowledgment' | 'volunteer_work';
    title: string;
    description: string;
  }[];
  skills: string[];
  coverLetter: string;
  top3Strengths: string[];
  thingsToRemove: {
    title: string;
    reason: string;
  }[];
  thingsToAdd: {
    title: string;
    reason: string;
  }[];
  filename: string;
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
    },
    skills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          items: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["category", "items"]
      }
    },
    thingsToRemove: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ['title', 'reason']
      }
    },
    thingsToAdd: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ['title', 'reason']
      }
    },
    scores: {
      type: Type.OBJECT,
      properties: {
        geral: { type: Type.NUMBER },
        resumo: { type: Type.NUMBER },
        experiencia: { type: Type.NUMBER },
        habilidades: { type: Type.NUMBER },
        cursos: { type: Type.NUMBER }
      },
      required: ["geral", "resumo", "experiencia", "habilidades", "cursos"]
    }
  },
  required: ["metadata", "headline", "summary", "experience", "skills", "education", "thingsToRemove", "thingsToAdd", "scores"]
};

const gupySchema = {
  type: Type.OBJECT,
  properties: {
    scores: {
      type: Type.OBJECT,
      properties: {
        geral: { type: Type.NUMBER },
        experiencias: { type: Type.NUMBER },
        cursosCertificados: { type: Type.NUMBER },
        habilidades: { type: Type.NUMBER }
      },
      required: ["geral", "experiencias", "cursosCertificados", "habilidades"]
    },
    keywords: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      }
    },
    experiences: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          company: { type: Type.STRING },
          role: { type: Type.STRING },
          period: { type: Type.STRING },
          bullets: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ['company', 'role', 'period', 'bullets']
      }
    },
    courses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ['course', 'certification', 'acknowledgment', 'volunteer_work'] },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ['type', 'title', 'description']
      }
    },
    skills: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      }
    },
    coverLetter: {
      type: Type.STRING
    },
    top3Strengths: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      }
    },
    thingsToRemove: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ['title', 'reason']
      }
    },
    thingsToAdd: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ['title', 'reason']
      }
    },
    filename: {
      type: Type.STRING
    }
  },
  required: [
    "scores",
    "keywords",
    "experiences",
    "courses",
    "skills",
    "coverLetter",
    "top3Strengths",
    "thingsToRemove",
    "thingsToAdd",
    "filename"
  ]
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
      1. Compare as informações do currículo base e da vaga e retorne uma nota de 0 a 100 para cada seção no objeto 'scores' (dividido em: geral, resumo, experiencia, habilidades e cursos).
      2. Adapte o currículo para destacar as experiências, competências e conquistas mais relevantes para a vaga.
      3. Identifique as palavras-chave mais importantes da descrição da vaga e as insira de forma natural ao longo do texto.
      4. Crie um resumo profissional ('summary') conciso e impactante na primeira pessoa do singular ou terceira pessoa.
      5. Reescreva as experiências profissionais ('experience'), estruturando cada atividade com bullet points acionáveis, focados em impacto ou resultados/conquistas quantificáveis, se existirem. (ex: "Aumentei a performance em 20% utilizando Next.js").
      6. Não invente informações que não estejam no currículo base.
      7. Extraia e divida as principais competências ('skills') por categorias lógicas (ex: "Front-end", "Back-end", "Metodologias", "Idiomas", etc.) em um formato de lista de objetos com 'category' e 'items'.
      8. Mantenha os dados de formação acadêmica do candidato originais, mas adapte se necessário a formatação.
      9. Gere metadados adequados para o PDF:
        - title: Ex. "Curriculo_Otimizado_[Nome_do_Candidato]"
        - author: Nome do Candidato (extraia do currículo)
        - subject: Cargo almejado (ex: "Desenvolvedor React")
        - keywords: Lista de palavras-chave separadas por vírgula.
      10. Inclua duas seções extras à parte, com coisas a incluir e coisas a remover para melhorar o currículo, com justificativas. 
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
      Você é um especialista em ATS e otimização de currículos para a plataforma Gupy.
      A plataforma Gupy usa inteligência artificial (a IA 'Gaia') para ranquear os candidatos com base na aderência da descrição das experiências e competências com os requisitos da vaga.
      Seu objetivo é reescrever e estruturar as informações do candidato para preenchimento direto nos campos da Gupy, maximizando a nota de aderência.

      Currículo Base:
      ${resumeText}

      Descrição da Vaga:
      ${jobDescription}

      Primeiramente, Compare os dados do currículo com o perfil ideal da vaga, considerando cargo, área, nível de experiência, habilidades exigidas, formação mínima, idiomas e outros requisitos específicos.

      Meça o grau de correspondência entre o currículo base e a descrição da vagaem cada seção e atribua pontuação proporcional de 0 a 100 no objeto 'scores', dividindo em: geral, experiencias, cursos/certificados e habilidades.
      Os critérios de avaliação estão descritos a seguir:
      
      CAMPOS DE ALTO PESO
      - Habilidades: comparadas diretamente com os requisitos técnicos da vaga. Sobreposição alta gera pontuação alta. Sobreposição baixa
      gera pontuação baixa mesmo com experiência real.
      - Título do cargo nas experiências: comparado com o cargo da vaga. Títulos padrão de mercado geram mais compatibilidade do que títulos internos ou genéricos.
      - Resumo profissional (Carta de Apresentação): lido para identificar palavras-chave de área e posicionamento. Resumos com termos técnicos específicos geram
      mais indexação do que resumos genéricos.
      - Nível de experiência: calculated a partir das datas dos cargos e comparado com o nível exigido pela vaga.

      CAMPOS DE PESO MÉDIO
      - Descrições de experiência: campo com maior volume de texto e maior superfície de sobreposição com palavras-chave da vaga.
      - Formação: comparada com o requisito de escolaridade. Quando a vaga exige área específica de formação, o peso é maior.
      - Idiomas: eliminatório quando a vaga configura idioma como filtro mínimo.

      COMPLETUDE
      - Certificações relevantes: quando a vaga exige ou valoriza certificações específicas, esse campo tem peso direto na pontuação

      Depois, reescreva os dados do currículo de modo a maximizar as pontuações, com as seguintes regras adicionais:

      Carta de Apresentação (coverLetter): 
      - 1ª linha - cargo padrão, especialidade, anos de experiência e segmento
      - 2ª linha - o que entrega e a ferramenta ou método principal
      Todo o resumo deve usar os termos técnicos da área com os nomes exatos

      Descrições das experiências (experiences):
      - Em vez de um texto extenso, retorne uma lista de bullet points ('bullets') para cada experiência.
      - Cada bullet point deve seguir a estrutura: ação + ferramenta + impacto ou resultado (ex: "Desenvolvi APIs RESTful com Node.js reduzindo o tempo de carregamento de dados em 15%").
      - Os termos técnicos devem aparecer nos bullet points de forma natural e contextualizada.
      - Preencha os campos 'company' e 'period' com os dados originais do currículo para cada experiência.

      Top 3 Competências (top3Strengths):
      - Devem ser obrigatoriamente 3 tags curtas de palavras/expressões chave técnicas relevantes para a vaga (ex: "React", "Node.js", "AWS"), NUNCA textos longos ou descrições.

      Nome do arquivo (filename):
      - Sugira um nome de arquivo adequado para salvar esta otimização da Gupy como Markdown, no formato "gupy_otimizado_[nome_do_candidato].md".

      Inclua também:
      - Itens que podem ser removidos por prejudicarem a nota final (com justificativa).
      - Itens que não estão no currículo e que podem ser adicionados para aumentar a nota final (com justificativa)

      Retorne os dados no formato JSON especificado abaixo:
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
    console.error("Erro ao otimizar para Gupy:", error);
    return { success: false, error: error.message || "Erro ao comunicar com a API do Gemini." };
  }
}
