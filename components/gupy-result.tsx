"use client";

import React, { useState } from "react";
import { OptimizedGupyResult } from "@/app/actions/optimize";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Copy, Check, ArrowLeft, Briefcase, User, Wrench, 
  Award, Sparkles, AlertTriangle, PlusCircle, CheckCircle, Download, FileCode
} from "lucide-react";

interface GupyResultProps {
  data: OptimizedGupyResult;
  onBack: () => void;
}

export const GupyResult: React.FC<GupyResultProps> = ({ data, onBack }) => {
  const [state, setState] = useState<OptimizedGupyResult>(data);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [id]: true }));
      toast.success("Copiado para a área de transferência!");
      
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [id]: false }));
      }, 2000);
    } catch (err) {
      console.error("Falha ao copiar texto: ", err);
      toast.error("Erro ao copiar o texto.");
    }
  };

  const handleCoverLetterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState((prev) => ({ ...prev, coverLetter: e.target.value }));
  };

  const handleExperienceFieldChange = (index: number, field: string, value: string) => {
    setState((prev) => {
      const experiences = [...prev.experiences];
      experiences[index] = { ...experiences[index], [field]: value };
      return { ...prev, experiences };
    });
  };

  const handleExperienceBulletsChange = (index: number, text: string) => {
    const bullets = text.split("\n").filter((b) => b.trim() !== "");
    setState((prev) => {
      const experiences = [...prev.experiences];
      experiences[index] = { ...experiences[index], bullets };
      return { ...prev, experiences };
    });
  };

  const handleCourseFieldChange = (index: number, field: string, value: string) => {
    setState((prev) => {
      const courses = [...prev.courses];
      courses[index] = { ...courses[index], [field]: value };
      return { ...prev, courses };
    });
  };

  const handleExportMarkdown = () => {
    const mdContent = `
# Otimização de Currículo para Gupy

## Informações do Arquivo
- **Arquivo Sugerido**: ${state.filename}
- **Score Geral**: ${state.scores.geral}%
- **Score Experiências**: ${state.scores.experiencias}%
- **Score Habilidades**: ${state.scores.habilidades}%
- **Score Cursos**: ${state.scores.cursosCertificados}%

## Sobre Você / Carta de Apresentação
${state.coverLetter}

## Experiências Profissionais
${state.experiences.map((exp) => `
### ${exp.role} em ${exp.company} (${exp.period})
${exp.bullets.map(b => `- ${b}`).join("\n")}
`).join("\n")}

## Competências / Palavras-chave
${state.skills.join(", ")}

## Cursos e Certificações
${state.courses.map(c => `- **[${c.type.toUpperCase()}]** ${c.title}: ${c.description}`).join("\n")}

## Top 3 Competências Principais
${state.top3Strengths.map(s => `- ${s}`).join("\n")}

## Recomendações de Aprimoramento

### O que Adicionar
${state.thingsToAdd.map(t => `- **${t.title}**: ${t.reason}`).join("\n")}

### O que Remover
${state.thingsToRemove.map(t => `- **${t.title}**: ${t.reason}`).join("\n")}
`.trim();

    const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", state.filename || "gupy_otimizado.md");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Resultados exportados em Markdown (.md) com sucesso!");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/5";
    if (score >= 50) return "text-amber-400 border-amber-500/30 bg-amber-500/5";
    return "text-rose-400 border-rose-500/30 bg-rose-500/5";
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sky-950/40 pb-5">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="border-sky-500/20 bg-slate-900/60 hover:bg-sky-950/40 text-sky-400 hover:text-sky-300 transition-all rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-sky-400" />
              Otimização para Plataforma Gupy
            </h1>
            <p className="text-base text-slate-400 mt-1">
              Edite os campos, copie as seções otimizadas e exporte os resultados finais.
            </p>
          </div>
        </div>
        <Button
          onClick={handleExportMarkdown}
          className="bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-semibold shadow-lg shadow-sky-950/50 border border-sky-400/20 px-5 py-2.5 transition-all flex items-center gap-2 rounded-xl self-start md:self-auto"
        >
          <FileCode className="h-4.5 w-4.5" />
          Exportar Markdown (.md)
        </Button>
      </div>

      {/* Dashboard de Scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Score Geral */}
        <Card className={`border backdrop-blur-md shadow-lg ${getScoreColor(state.scores.geral)}`}>
          <CardContent className="pt-6 text-center space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Score Geral</span>
            <div className="text-4xl font-extrabold">{state.scores.geral}%</div>
            <p className="text-[10px] opacity-60">Aderência total</p>
          </CardContent>
        </Card>

        {/* Score Experiências */}
        <Card className={`border backdrop-blur-md shadow-lg ${getScoreColor(state.scores.experiencias)}`}>
          <CardContent className="pt-6 text-center space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Experiências</span>
            <div className="text-4xl font-extrabold">{state.scores.experiencias}%</div>
            <p className="text-[10px] opacity-60">Aderência profissional</p>
          </CardContent>
        </Card>

        {/* Score Habilidades */}
        <Card className={`border backdrop-blur-md shadow-lg ${getScoreColor(state.scores.habilidades)}`}>
          <CardContent className="pt-6 text-center space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Habilidades</span>
            <div className="text-4xl font-extrabold">{state.scores.habilidades}%</div>
            <p className="text-[10px] opacity-60">Termos técnicos</p>
          </CardContent>
        </Card>

        {/* Score Cursos */}
        <Card className={`border backdrop-blur-md shadow-lg ${getScoreColor(state.scores.cursosCertificados)}`}>
          <CardContent className="pt-6 text-center space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Cursos/Certificados</span>
            <div className="text-4xl font-extrabold">{state.scores.cursosCertificados}%</div>
            <p className="text-[10px] opacity-60">Escolaridade & Cursos</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        {/* Seção Sobre Mim / Carta de Apresentação */}
        <Card className="border-sky-500/10 bg-slate-900/50 backdrop-blur-md shadow-xl text-slate-200">
          <CardHeader className="border-b border-sky-950/30 pb-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-sky-400" />
              <div>
                <CardTitle className="text-xl font-bold text-sky-300">Sobre Você / Carta de Apresentação</CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Edite e cole no campo "Sobre você" ou "Resumo Profissional" da Gupy.
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy("coverLetter", state.coverLetter)}
              className="border-sky-500/30 text-sky-400 hover:bg-sky-950/50 flex items-center gap-1.5 transition-all"
            >
              {copiedStates["coverLetter"] ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copiar</span>
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent className="pt-5 space-y-3">
            <Textarea
              value={state.coverLetter}
              onChange={handleCoverLetterChange}
              className="min-h-[160px] bg-slate-950/60 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500/10 text-base resize-y"
              placeholder="Carta de Apresentação..."
            />
          </CardContent>
        </Card>

        {/* Seção Experiências Profissionais */}
        <Card className="border-sky-500/10 bg-slate-900/50 backdrop-blur-md shadow-xl text-slate-200">
          <CardHeader className="border-b border-sky-950/30 pb-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-sky-400" />
              <div>
                <CardTitle className="text-xl font-bold text-sky-300">Experiências Profissionais</CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Edite os cargos/responsabilidades e copie a descrição detalhada estruturada em bullets.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5 space-y-6">
            {state.experiences.map((exp, index) => {
              const expId = `exp_${index}`;
              const formattedBulletsText = exp.bullets.map(b => `• ${b}`).join("\n");
              
              return (
                <div key={index} className="p-5 rounded-xl bg-slate-950/40 border border-slate-900 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                      <div>
                        <Label className="text-xs text-slate-400 font-semibold uppercase">Cargo</Label>
                        <Input
                          value={exp.role}
                          onChange={(e) => handleExperienceFieldChange(index, "role", e.target.value)}
                          className="bg-slate-900 border-slate-800 text-slate-100 text-base h-10 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-400 font-semibold uppercase">Empresa</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => handleExperienceFieldChange(index, "company", e.target.value)}
                          className="bg-slate-900 border-slate-800 text-slate-100 text-base h-10 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-400 font-semibold uppercase">Período</Label>
                        <Input
                          value={exp.period}
                          onChange={(e) => handleExperienceFieldChange(index, "period", e.target.value)}
                          className="bg-slate-900 border-slate-800 text-slate-100 text-base h-10 mt-1"
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(expId, formattedBulletsText)}
                      className="border border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white flex items-center gap-1.5 transition-all self-end md:self-auto h-10"
                    >
                      {copiedStates[expId] ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-400" />
                          <span className="text-emerald-400 text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span className="text-xs">Copiar Atividades</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400 font-semibold">Atividades Otimizadas (Uma por linha)</Label>
                    <Textarea
                      value={exp.bullets.join("\n")}
                      onChange={(e) => handleExperienceBulletsChange(index, e.target.value)}
                      className="min-h-[120px] bg-slate-950/60 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500/10 text-base resize-y font-mono"
                      placeholder="Cada linha representa uma atividade..."
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Seção Competências */}
        <Card className="border-sky-500/10 bg-slate-900/50 backdrop-blur-md shadow-xl text-slate-200">
          <CardHeader className="border-b border-sky-950/30 pb-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-sky-400" />
              <div>
                <CardTitle className="text-xl font-bold text-sky-300">Competências</CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Adicione como tags no campo de Competências da Gupy.
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy("skills", state.skills.join(", "))}
              className="border-sky-500/30 text-sky-400 hover:bg-sky-950/50 flex items-center gap-1.5 transition-all"
            >
              {copiedStates["skills"] ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copiar Lista</span>
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="flex flex-wrap gap-2">
              {state.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm px-3.5 py-1.5 rounded-full font-medium"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seção Cursos & Certificações */}
        {state.courses && state.courses.length > 0 && (
          <Card className="border-sky-500/10 bg-slate-900/50 backdrop-blur-md shadow-xl text-slate-200">
            <CardHeader className="border-b border-sky-950/30 pb-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-sky-400" />
                <div>
                  <CardTitle className="text-xl font-bold text-sky-300">Cursos, Certificações e Idiomas</CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    Edite e copie individualmente para preenchimento dos campos na Gupy.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              {state.courses.map((course, index) => {
                const courseId = `course_${index}`;
                return (
                  <div key={index} className="p-4 rounded-xl bg-slate-950/30 border border-slate-900 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 flex-grow">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/30">
                          {course.type === "course" ? "Curso" : course.type === "certification" ? "Certificação" : course.type === "volunteer_work" ? "Voluntariado" : "Reconhecimento"}
                        </span>
                        <div className="flex-1">
                          <Label className="text-xs text-slate-500 font-semibold uppercase">Título</Label>
                          <Input
                            value={course.title}
                            onChange={(e) => handleCourseFieldChange(index, "title", e.target.value)}
                            className="bg-slate-900 border-slate-800 text-slate-100 text-sm h-8 mt-1"
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(courseId, `${course.title}: ${course.description}`)}
                        className="text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-900 flex-shrink-0 h-8 w-8"
                      >
                        {copiedStates[courseId] ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500 font-semibold">Descrição</Label>
                      <Textarea
                        value={course.description}
                        onChange={(e) => handleCourseFieldChange(index, "description", e.target.value)}
                        className="min-h-[60px] bg-slate-900 border-slate-800 text-slate-200 text-sm resize-y"
                        placeholder="Descrição do curso/certificação..."
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Top 3 Strengths */}
        {state.top3Strengths && state.top3Strengths.length > 0 && (
          <Card className="border-sky-500/10 bg-slate-900/50 backdrop-blur-md shadow-xl text-slate-200">
            <CardHeader className="border-b border-sky-950/30 pb-4">
              <CardTitle className="text-xl font-bold text-sky-300">Habilidades Técnicas Principais (Top 3)</CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {state.top3Strengths.map((strength, index) => (
                  <div key={index} className="p-4 rounded-xl border border-sky-500/20 bg-sky-500/5 text-center flex flex-col items-center justify-center space-y-2">
                    <CheckCircle className="h-6 w-6 text-sky-400" />
                    <span className="text-base font-bold text-slate-100">{strength}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recomendações de Aprimoramento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Adicionar */}
          <Card className="border-emerald-500/10 bg-emerald-950/5 text-slate-200">
            <CardHeader className="border-b border-emerald-950/20 pb-4">
              <div className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-emerald-400" />
                <CardTitle className="text-lg font-bold text-emerald-300">Itens recomendados para Adicionar</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {state.thingsToAdd.length > 0 ? (
                state.thingsToAdd.map((item, index) => (
                  <div key={index} className="space-y-1 border-b border-emerald-950/20 pb-2.5 last:border-0 last:pb-0">
                    <h5 className="font-bold text-sm text-slate-200">{item.title}</h5>
                    <p className="text-xs text-slate-400 leading-normal">{item.reason}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">Nenhuma recomendação de inserção necessária.</p>
              )}
            </CardContent>
          </Card>

          {/* Remover */}
          <Card className="border-rose-500/10 bg-rose-950/5 text-slate-200">
            <CardHeader className="border-b border-rose-950/20 pb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-400" />
                <CardTitle className="text-lg font-bold text-rose-300">Itens recomendados para Remover</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {state.thingsToRemove.length > 0 ? (
                state.thingsToRemove.map((item, index) => (
                  <div key={index} className="space-y-1 border-b border-rose-950/20 pb-2.5 last:border-0 last:pb-0">
                    <h5 className="font-bold text-sm text-slate-200">{item.title}</h5>
                    <p className="text-xs text-slate-400 leading-normal">{item.reason}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">Nenhum elemento prejudicial detectado.</p>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
