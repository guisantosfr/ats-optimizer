"use server";

import { openai } from "@/lib/openai";
import { GupyResult, gupySchema, LinkedinResult, linkedinSchema } from "@/lib/schemas/optimize";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

export async function optimizeForLinkedin(
  resumeText: string,
  jobDescription: string
): Promise<{ success: boolean; data?: LinkedinResult; error?: string }> {
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
      9. Gere metadados adequados para o PDF no objeto 'metadata':
        - title: Cargo identificado na vaga.
        - creator: Nome do Candidato (extraia do currículo base).
        - keywords: Lista de principais palavras-chave da descrição da vaga, separadas por vírgula.
        - subject: Cargo almejado ou área de atuação identificada na descrição da vaga.
        
      10. Extraia as informações de contato do candidato (email, phone/telefone, linkedin/perfil do LinkedIn, website/portfólio/github, e location/localização como Cidade/Estado) do currículo base e retorne no objeto 'contact'. Caso algum dado não exista no currículo base, preencha-o como uma string vazia ("").
      
      11. Inclua duas seções extras à parte, com coisas a incluir e coisas a remover para melhorar o currículo, com justificativas. 
    `;

    const response = await openai.responses.parse({
      model: process.env.OPENAI_MODEL!,
      input: prompt,
      text: {
        format: zodTextFormat(
          linkedinSchema,
          "linkedin_optimization"
        ),
      },
    });

    if (!response.output_parsed) {
      throw new Error("A IA não retornou um resultado válido.");
    }

    return {
      success: true,
      data: response.output_parsed,
    };

  } catch (error: unknown) {
    console.error(
      "Erro na action optimizeForLinkedin:",
      error
    );

    if (error instanceof OpenAI.AuthenticationError) {
      return {
        success: false,
        error: "Erro de configuração do serviço de IA.",
      };
    }

    if (error instanceof OpenAI.RateLimitError) {
      return {
        success: false,
        error: "O serviço de IA está temporariamente sobrecarregado. Tente novamente em alguns instantes.",
      };
    }

    if (error instanceof OpenAI.InternalServerError) {
      return {
        success: false,
        error: "O serviço de IA está temporariamente indisponível. Tente novamente mais tarde.",
      };
    }

    if (error instanceof OpenAI.APIConnectionError) {
      return {
        success: false,
        error: "Não foi possível conectar ao serviço de IA. Tente novamente mais tarde.",
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao comunicar com o serviço de IA.",
    };
  }
}

export async function optimizeForGupy(
  resumeText: string,
  jobDescription: string
): Promise<{ success: boolean; data?: GupyResult; error?: string }> {
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
      - Incluir:
        - cargo padrão, especialidade, anos de experiência e segmento
        - o que entrega e a ferramenta ou método principal
      - Use os termos técnicos da área com os nomes exatos
      - Use até 1500 caracteres, relacionando a descrição da vaga com o currículo, de forma personalizada para a empresa da vaga

      Descrições das experiências (experiences):
      - Em vez de um texto extenso, retorne uma lista de bullet points ('bullets') para cada experiência.
      - Cada bullet point deve seguir a estrutura: ação + ferramenta + impacto ou resultado (ex: "Desenvolvi APIs RESTful com Node.js reduzindo o tempo de carregamento de dados em 15%").
      - Os termos técnicos devem aparecer nos bullet points de forma natural e contextualizada.
      - Não economize caracteres e descreva as atividades nas experiências profissionais de forma completa e clara.
      - Preencha os campos 'company' e 'period' com os dados originais do currículo para cada experiência.

      Top 3 Competências (top3Strengths):
      - Devem ser obrigatoriamente 3 tags curtas de palavras/expressões chave técnicas relevantes para a vaga (ex: "React", "Node.js", "AWS"), NUNCA textos longos ou descrições.

      Nome do arquivo (filename):
      - Sugira um nome de arquivo adequado para salvar esta otimização da Gupy como Markdown, no formato "gupy_otimizado_[nome_do_candidato].md".
      - Inclua no nome do arquivo: cargo da vaga e nome da empresa (se houver).

      Inclua também:
      - Itens que podem ser removidos por prejudicarem a nota final (com justificativa).
      - Itens que não estão no currículo e que podem ser adicionados para aumentar a nota final (com justificativa)

      Retorne os dados no formato JSON especificado abaixo:
    `;

    const response = await openai.responses.parse({
      model: process.env.OPENAI_MODEL!,
      input: prompt,
      text: {
        format: zodTextFormat(
          gupySchema,
          "gupy_optimization"
        ),
      },
    });

    if (!response.output_parsed) {
      throw new Error("A IA não retornou um resultado válido.");
    }

    return {
      success: true,
      data: response.output_parsed,
    };

  } catch (error: unknown) {
    console.error(
      "Erro ao otimizar para a Gupy:",
      error
    );

    if (error instanceof OpenAI.AuthenticationError) {
      return {
        success: false,
        error: "Erro de configuração do serviço de IA.",
      };
    }

    if (error instanceof OpenAI.RateLimitError) {
      return {
        success: false,
        error: "O serviço de IA está temporariamente sobrecarregado. Tente novamente em alguns instantes.",
      };
    }

    if (error instanceof OpenAI.InternalServerError) {
      return {
        success: false,
        error: "O serviço de IA está temporariamente indisponível. Tente novamente mais tarde.",
      };
    }

    if (error instanceof OpenAI.APIConnectionError) {
      return {
        success: false,
        error: "Não foi possível conectar ao serviço de IA. Tente novamente mais tarde.",
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao comunicar com o serviço de IA.",
    };
  }
}
