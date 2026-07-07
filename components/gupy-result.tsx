"use client";

import React, { useState } from "react";
import { OptimizedGupyResult } from "@/app/actions/optimize";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Check, ArrowLeft, Briefcase, User, Wrench, FilePlus, Sparkles } from "lucide-react";

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
          <p className="text-sm text-slate-400 mt-1">
            Copie as seções otimizadas pela IA e cole diretamente nos campos do formulário da Gupy.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Seção Sobre Mim */}
        <Card className="border-sky-500/10 bg-slate-900/50 backdrop-blur-md shadow-xl text-slate-200">
          <CardHeader className="border-b border-sky-950/30 pb-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-sky-400" />
              <div>
                <CardTitle className="text-base text-sky-300">Sobre Você / Resumo Profissional</CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Cole no campo "Sobre você" ou "Resumo Profissional" da Gupy.
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy("aboutMe", data.aboutMe)}
              className="border-sky-500/30 text-sky-400 hover:bg-sky-950/50 flex items-center gap-1.5 transition-all"
            >
              {copiedStates["aboutMe"] ? (
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
            <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap bg-slate-950/40 p-4 rounded-lg border border-slate-900">
              {data.aboutMe}
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
              const fullCopyText = `Cargo: ${exp.role}\nEmpresa: ${exp.company}\nPeríodo: ${exp.period}\n\nDescrição das Atividades:\n${exp.description}`;
              
              return (
                <div key={index} className="p-4 rounded-lg bg-slate-950/40 border border-slate-900 space-y-4">
                  <div className="flex flex-row items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h4 className="font-bold text-slate-100">{exp.role}</h4>
                      <p className="text-xs text-sky-400 mt-0.5">{exp.company} — {exp.period}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(expId, exp.description)}
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
                  <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                    {exp.description}
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
              onClick={() => handleCopy("skills", data.skills)}
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
            <p className="text-sm leading-relaxed text-slate-300 bg-slate-950/40 p-4 rounded-lg border border-slate-900">
              {data.skills}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {data.skills.split(",").map((skill, index) => (
                <span
                  key={index}
                  className="bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs px-2 py-0.5 rounded"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        {data.additionalInfo && (
          <Card className="border-sky-500/10 bg-slate-900/50 backdrop-blur-md shadow-xl text-slate-200">
            <CardHeader className="border-b border-sky-950/30 pb-4 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <FilePlus className="h-5 w-5 text-sky-400" />
                <div>
                  <CardTitle className="text-base text-sky-300">Informações Adicionais</CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    Adicione ao final do cadastro (certificações, cursos, projetos).
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy("additionalInfo", data.additionalInfo)}
                className="border-sky-500/30 text-sky-400 hover:bg-sky-950/50 flex items-center gap-1.5 transition-all"
              >
                {copiedStates["additionalInfo"] ? (
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
              <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap bg-slate-950/40 p-4 rounded-lg border border-slate-900">
                {data.additionalInfo}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
