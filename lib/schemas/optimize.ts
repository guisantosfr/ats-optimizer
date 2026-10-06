import { z } from "zod";

const optimizationItemSchema = z.object({
    title: z.string(),
    reason: z.string(),
});

const experienceSchema = z.object({
    company: z.string(),
    role: z.string(),
    period: z.string(),
    bullets: z.array(z.string()),
});

const educationSchema = z.object({
    institution: z.string(),
    degree: z.string(),
    period: z.string(),
});

const skillCategorySchema = z.object({
    category: z.string(),
    items: z.array(z.string()),
});

export const linkedinSchema = z.object({
    metadata: z.object({
        title: z.string(),
        creator: z.string(),
        keywords: z.string(),
        subject: z.string(),
    }),

    contact: z.object({
        email: z.string(),
        phone: z.string(),
        linkedin: z.string(),
        website: z.string(),
        location: z.string(),
    }),

    headline: z.string(),

    summary: z.string(),

    experience: z.array(experienceSchema),

    education: z.array(educationSchema),

    skills: z.array(skillCategorySchema),

    thingsToRemove: z.array(optimizationItemSchema),

    thingsToAdd: z.array(optimizationItemSchema),

    scores: z.object({
        geral: z.number(),
        resumo: z.number(),
        experiencia: z.number(),
        habilidades: z.number(),
        cursos: z.number(),
    }),
});

export const gupySchema = z.object({
    scores: z.object({
        geral: z.number(),
        experiencias: z.number(),
        cursosCertificados: z.number(),
        habilidades: z.number(),
    }),

    keywords: z.array(z.string()),

    experiences: z.array(experienceSchema),

    courses: z.array(
        z.object({
            type: z.enum([
                "course",
                "certification",
                "acknowledgment",
                "volunteer_work",
            ]),
            title: z.string(),
            description: z.string(),
        })
    ),

    skills: z.array(z.string()),

    coverLetter: z.string(),

    top3Strengths: z.array(z.string()),

    thingsToRemove: z.array(optimizationItemSchema),

    thingsToAdd: z.array(optimizationItemSchema),

    filename: z.string(),
});

export type LinkedinResult = z.infer<typeof linkedinSchema>;
export type GupyResult = z.infer<typeof gupySchema>;