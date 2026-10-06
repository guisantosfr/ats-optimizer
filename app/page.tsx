"use client";

import React, { useState, useRef } from "react";
import { optimizeForLinkedin, optimizeForGupy } from "@/app/actions/optimize";
import { GupyResult } from "@/components/gupy-result";
import { LinkedinResult } from "@/components/linkedin-result";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Sparkles, Briefcase, Brain } from "lucide-react";
import { GupyResult as GupyResultType, LinkedinResult as LinkedinResultType } from "@/lib/schemas/optimize";

type Platform = "linkedin" | "gupy";
type ViewState = "input" | "linkedin_result" | "gupy_result";

export default function Home() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [platform, setPlatform] = useState<Platform>("linkedin");
  const [view, setView] = useState<ViewState>("input");

  const [isLoading, setIsLoading] = useState(false);
  const [linkedinResult, setLinkedinResult] = useState<LinkedinResultType | null>(null);
  const [gupyResult, setGupyResult] = useState<GupyResultType | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isTxt = file.name.endsWith(".txt");
    const isMd = file.name.endsWith(".md");
    if (!isTxt && !isMd) {
      toast.error("Formato inválido. Apenas arquivos .txt ou .md são suportados.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setResumeText(text);
      toast.success(`Currículo carregado com sucesso: ${file.name}`);
    };
    reader.onerror = () => {
      toast.error("Erro ao ler o arquivo.");
    };
    reader.readAsText(file);
  };

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeText.trim()) {
      toast.error("Por favor, insira ou envie o seu currículo.");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Por favor, cole a descrição da vaga.");
      return;
    }

    setIsLoading(true);

    try {
      if (platform === "linkedin") {
        const result = await optimizeForLinkedin(resumeText, jobDescription);
        if (result.success && result.data) {
          setLinkedinResult(result.data);
          setView("linkedin_result");
          toast.success("Currículo otimizado com sucesso para o LinkedIn!");
        } else {
          toast.error(result.error || "Ocorreu um erro na otimização.");
        }
      } else {
        const result = await optimizeForGupy(resumeText, jobDescription);
        if (result.success && result.data) {
          setGupyResult(result.data);
          setView("gupy_result");
          toast.success("Currículo otimizado com sucesso para a Gupy!");
        } else {
          toast.error(result.error || "Ocorreu um erro na otimização.");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar a tela de carregamento (Loading Skeleton)
  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-screen px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950/20 text-slate-100">
        <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900/60 border border-sky-500/20 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center space-y-6 animate-pulse">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-sky-500/30 border-t-sky-500 animate-spin flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-sky-400 animate-bounce" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-100">Otimizando seu currículo...</h2>
            <p className="text-slate-400 max-w-xs">
              Nossa IA está analisando a vaga e reestruturando seus dados para passar no ATS.
            </p>
          </div>
          <div className="w-full space-y-3 pt-4 border-t border-sky-950/40">
            <div className="h-4 bg-slate-800/80 rounded w-3/4 mx-auto" />
            <div className="h-3 bg-slate-800/80 rounded w-5/6 mx-auto" />
            <div className="h-3 bg-slate-800/80 rounded w-2/3 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  // Renderizar telas de resultado de acordo com o estado do view
  if (view === "linkedin_result" && linkedinResult) {
    return (
      <div className="flex-1 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950/10 min-h-screen">
        <LinkedinResult initialData={linkedinResult} onBack={() => setView("input")} />
      </div>
    );
  }

  if (view === "gupy_result" && gupyResult) {
    return (
      <div className="flex-1 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950/10 min-h-screen">
        <GupyResult data={gupyResult} onBack={() => setView("input")} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950/30 min-h-screen">
      <header className="border-b border-sky-950/40 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-100 tracking-tight bg-gradient-to-r from-slate-100 via-sky-200 to-blue-200 bg-clip-text text-transparent">
              ATS Optimizer
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 flex flex-col">

        <form onSubmit={handleOptimize} className="w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

            <Card className="border-sky-500/10 bg-slate-900/40 backdrop-blur-md shadow-xl text-slate-200 flex flex-col h-full">
              <CardHeader className="border-b border-sky-950/30 pb-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-sky-300">Dados do Currículo</CardTitle>
                </div>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".txt,.md"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-sky-500/20 bg-slate-900/60 hover:bg-sky-950/40 text-sky-400 hover:text-sky-300 transition-all flex items-center gap-1.5"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Fazer Upload (.txt, .md)
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-2 flex-1 flex flex-col">
                <Textarea
                  placeholder="Cole aqui o texto do seu currículo atual..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="h-[350px] max-h-[350px] flex-1 bg-slate-950/60 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500/10 resize-none overflow-y-auto custom-scrollbar"
                />
              </CardContent>
            </Card>

            <div className="flex flex-col gap-6 h-full justify-between">
              <Card className="border-sky-500/10 bg-slate-900/40 backdrop-blur-md shadow-xl text-slate-200">
                <CardHeader className="border-b border-sky-950/30 pb-4">
                  <CardTitle className="text-lg text-sky-300">Dados da Vaga</CardTitle>
                </CardHeader>
                <CardContent className="pt-3">
                  <Textarea
                    placeholder="Cole aqui a descrição completa da vaga de emprego (requisitos, competências, atividades)..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="h-[240px] bg-slate-950/60 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500/10 resize-none overflow-y-auto custom-scrollbar"
                  />
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Label className="font-semibold text-slate-300">Plataforma alvo:</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPlatform("linkedin")}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${platform === "linkedin"
                      ? "border-sky-500 bg-sky-950/20 shadow-[0_0_15px_rgba(14,165,233,0.15)]"
                      : "border-slate-800 bg-slate-900/20 hover:border-slate-700"
                      }`}
                  >
                    <div className={`p-1.5 rounded-lg ${platform === "linkedin" ? "bg-sky-500/20 text-sky-400" : "bg-slate-800 text-slate-400"}`}>
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold text-sm ${platform === "linkedin" ? "text-sky-300" : "text-slate-200"}`}>
                        LinkedIn (PDF Otimizado)
                      </h3>
                    </div>
                  </div>

                  <div
                    onClick={() => setPlatform("gupy")}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${platform === "gupy"
                      ? "border-sky-500 bg-sky-950/20 shadow-[0_0_15px_rgba(14,165,233,0.15)]"
                      : "border-slate-800 bg-slate-900/20 hover:border-slate-700"
                      }`}
                  >
                    <div className={`p-1.5 rounded-lg ${platform === "gupy" ? "bg-sky-500/20 text-sky-400" : "bg-slate-800 text-slate-400"}`}>
                      <Brain className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold text-sm ${platform === "gupy" ? "text-sky-300" : "text-slate-200"}`}>
                        Gupy (Copiar e Colar)
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-sky-950/40 pt-6 flex justify-end">
            <Button
              type="submit"
              className="w-full md:w-auto md:px-8 py-6 text-base font-semibold bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-400 hover:to-blue-500 text-white border border-sky-400/20 shadow-lg shadow-sky-500/10 transition-all flex items-center justify-center gap-2 rounded-xl group"
            >
              <Sparkles className="h-5 w-5 text-sky-200 group-hover:scale-110 transition-transform" />
              Analisar e Otimizar Currículo
            </Button>
          </div>

        </form>
      </main>
    </div>
  );
}
