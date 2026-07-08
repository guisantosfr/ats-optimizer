"use client";

import React, { useState } from "react";
import { OptimizedGupyResult } from "@/app/actions/optimize";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Copy, Check, ArrowLeft, Briefcase, User, Wrench,
  Award, Sparkles, AlertTriangle, PlusCircle, CheckCircle
} from "lucide-react";

interface GupyResultProps {
  data: OptimizedGupyResult;
  onBack: () => void;
}

export const GupyResult: React.FC<GupyResultProps> = ({ data, onBack }) => {
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/5";
    if (score >= 50) return "text-amber-400 border-amber-500/30 bg-amber-500/5";
    return "text-rose-400 border-rose-500/30 bg-rose-500/5";
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-sky-950/40 pb-5">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="border-sky-500/20 bg-slate-900/60 hover:bg-sky-950/40 text-sky-400 hover:text-sky-300 transition-all rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-sky-400" />
            Otimização para Plataforma Gupy
          </h1>
          <p className="text-slate-400 mt-1">
            Copie as seções otimizadas pela IA e cole diretamente nos campos do formulário da Gupy.
          </p>
        </div>
      </div>

      {/* Dashboard de Scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Score Geral */}
        <Card className={`border backdrop-blur-md shadow-lg ${getScoreColor(data.scores.geral)}`}>
          <CardContent className="pt-6 text-center space-y-1">
            <span className="font-semibold uppercase tracking-wider opacity-80">Score Geral</span>
            <div className="text-3xl font-extrabold">{data.scores.geral}%</div>
            <p className="text-[10px] opacity-60">Aderência total</p>
          </CardContent>
        </Card>

        {/* Score Experiências */}
        <Card className={`border backdrop-blur-md shadow-lg ${getScoreColor(data.scores.experiencias)}`}>
          <CardContent className="pt-6 text-center space-y-1">
            <span className="font-semibold uppercase tracking-wider opacity-80">Experiências</span>
            <div className="text-3xl font-extrabold">{data.scores.experiencias}%</div>
            <p className="text-[10px] opacity-60">Aderência profissional</p>
          </CardContent>
        </Card>

        {/* Score Habilidades */}
        <Card className={`border backdrop-blur-md shadow-lg ${getScoreColor(data.scores.habilidades)}`}>
          <CardContent className="pt-6 text-center space-y-1">
            <span className="font-semibold uppercase tracking-wider opacity-80">Habilidades</span>
            <div className="text-3xl font-extrabold">{data.scores.habilidades}%</div>
            <p className="text-[10px] opacity-60">Termos técnicos</p>
          </CardContent>
        </Card>

        {/* Score Cursos */}
        <Card className={`border backdrop-blur-md shadow-lg ${getScoreColor(data.scores.cursosCertificados)}`}>
          <CardContent className="pt-6 text-center space-y-1">
            <span className="font-semibold uppercase tracking-wider opacity-80">Cursos/Certificados</span>
            <div className="text-3xl font-extrabold">{data.scores.cursosCertificados}%</div>
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
                <CardTitle className="text-base text-sky-300">Sobre Você / Carta de Apresentação</CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Cole no campo "Sobre você" ou "Resumo Profissional" da Gupy.
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy("coverLetter", data.coverLetter)}
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
          <CardContent className="pt-5">
            <p className="leading-relaxed text-slate-300 whitespace-pre-wrap bg-slate-950/40 p-4 rounded-lg border border-slate-900">
              {data.coverLetter}
            </p>
          </CardContent>
        </Card>

        {/* Seção Experiências Profissionais */}
        <Card className="border-sky-500/10 bg-slate-900/50 backdrop-blur-md shadow-xl text-slate-200">
          <CardHeader className="border-b border-sky-950/30 pb-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-sky-400" />
              <div>
                <CardTitle className="text-base text-sky-300">Experiências Profissionais</CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Copie a descrição detalhada para cada uma das experiências cadastradas na Gupy.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5 space-y-6">
            {data.experiences.map((exp, index) => {
              const expId = `exp_${index}`;

              return (
                <div key={index} className="p-4 rounded-lg bg-slate-950/40 border border-slate-900 space-y-4">
                  <div className="flex flex-row items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h4 className="font-bold text-slate-100">{exp.role}</h4>
                      <p className="text-sky-400 mt-0.5">{exp.company} — {exp.period}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(expId, exp.activitiesDescription)}
                      className="border border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white flex items-center gap-1.5 transition-all"
                    >
                      {copiedStates[expId] ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-400" />
                          <span className="text-emerald-400 text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span className="text-xs">Copiar Descrição</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="leading-relaxed text-slate-300 whitespace-pre-wrap">
                    {exp.activitiesDescription}
                  </p>
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
                <CardTitle className="text-base text-sky-300">Competências</CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Adicione como tags no campo de Competências da Gupy.
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy("skills", data.skills.join(", "))}
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
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-sky-500/10 border border-sky-500/20 text-sky-400 px-2.5 py-1 rounded-full font-medium"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seção Cursos & Certificações */}
        {data.courses && data.courses.length > 0 && (
          <Card className="border-sky-500/10 bg-slate-900/50 backdrop-blur-md shadow-xl text-slate-200">
            <CardHeader className="border-b border-sky-950/30 pb-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-sky-400" />
                <div>
                  <CardTitle className="text-base text-sky-300">Cursos, Certificações e Idiomas</CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    Copie individualmente para preenchimento dos campos na Gupy.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              {data.courses.map((course, index) => {
                const courseId = `course_${index}`;
                return (
                  <div key={index} className="p-3.5 rounded-lg bg-slate-950/30 border border-slate-900 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/30">
                          {course.type === "course" ? "Curso" : course.type === "certification" ? "Certificação" : course.type === "volunteer_work" ? "Voluntariado" : "Reconhecimento"}
                        </span>
                        <h4 className="font-semibold text-slate-200">{course.title}</h4>
                      </div>
                      <p className="text-slate-400 pl-1">{course.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(courseId, `${course.title}: ${course.description}`)}
                      className="text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-900 flex-shrink-0"
                    >
                      {copiedStates[courseId] ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Top 3 Strengths */}
        {data.top3Strengths && data.top3Strengths.length > 0 && (
          <Card className="border-sky-500/10 bg-slate-900/50 backdrop-blur-md shadow-xl text-slate-200">
            <CardHeader className="border-b border-sky-950/30 pb-4">
              <CardTitle className="text-base text-sky-300">Seus 3 Maiores Pontos Fortes para a Vaga</CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {data.top3Strengths.map((strength, index) => (
                  <div key={index} className="p-4 rounded-xl border border-sky-500/10 bg-sky-950/5 text-center flex flex-col items-center justify-center space-y-2">
                    <CheckCircle className="h-6 w-6 text-sky-400" />
                    <span className="font-semibold text-slate-200">{strength}</span>
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
                <CardTitle className="text-emerald-300">Itens recomendados para Adicionar</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {data.thingsToAdd.length > 0 ? (
                data.thingsToAdd.map((item, index) => (
                  <div key={index} className="space-y-1 border-b border-emerald-950/20 pb-2.5 last:border-0 last:pb-0">
                    <h5 className="font-bold text-slate-200">{item.title}</h5>
                    <p className="text-[11px] text-slate-400 leading-normal">{item.reason}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 italic">Nenhuma recomendação de inserção necessária.</p>
              )}
            </CardContent>
          </Card>

          {/* Remover */}
          <Card className="border-rose-500/10 bg-rose-950/5 text-slate-200">
            <CardHeader className="border-b border-rose-950/20 pb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-400" />
                <CardTitle className="text-rose-300">Itens recomendados para Remover</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {data.thingsToRemove.length > 0 ? (
                data.thingsToRemove.map((item, index) => (
                  <div key={index} className="space-y-1 border-b border-rose-950/20 pb-2.5 last:border-0 last:pb-0">
                    <h5 className="font-bold text-slate-200">{item.title}</h5>
                    <p className="text-[11px] text-slate-400 leading-normal">{item.reason}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 italic">Nenhum elemento prejudicial detectado.</p>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
