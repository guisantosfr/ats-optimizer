"use client";

import React, { useState, useEffect } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { OptimizedLinkedinResult } from "@/app/actions/optimize";
import { CvDocument } from "./cv-document";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import {
  FileText, ArrowLeft, Download, RefreshCw, Plus, Trash2,
  PlusCircle, AlertTriangle, ChevronDown
} from "lucide-react";

interface LinkedinResultProps {
  initialData: OptimizedLinkedinResult;
  onBack: () => void;
}

export const LinkedinResult: React.FC<LinkedinResultProps> = ({ initialData, onBack }) => {
  const [data, setData] = useState<OptimizedLinkedinResult>(initialData);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Atualizar dados do cabeçalho / metadados
  const handleMetadataChange = (key: string, value: string) => {
    setData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [key]: value,
      },
    }));
  };

  // Atualizar campos simples
  const handleSimpleFieldChange = (key: keyof OptimizedLinkedinResult, value: any) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Atualizar campos de experiências
  const handleExperienceChange = (index: number, key: string, value: any) => {
    setData((prev) => {
      const newExp = [...prev.experience];
      newExp[index] = { ...newExp[index], [key]: value };
      return { ...prev, experience: newExp };
    });
  };

  // Atualizar bullet points de uma experiência como string separada por quebras de linha
  const handleExperienceBulletsChange = (index: number, text: string) => {
    const bullets = text.split("\n").filter((b) => b.trim() !== "");
    setData((prev) => {
      const newExp = [...prev.experience];
      newExp[index] = { ...newExp[index], bullets };
      return { ...prev, experience: newExp };
    });
  };

  // Adicionar nova experiência
  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "Nova Empresa", role: "Cargo", period: "Período", bullets: ["Atividade 1"] },
      ],
    }));
  };

  // Remover experiência
  const removeExperience = (index: number) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, idx) => idx !== index),
    }));
  };

  // Atualizar campos de formação acadêmica
  const handleEducationChange = (index: number, key: string, value: string) => {
    setData((prev) => {
      const newEdu = [...prev.education];
      newEdu[index] = { ...newEdu[index], [key]: value };
      return { ...prev, education: newEdu };
    });
  };

  // Adicionar formação acadêmica
  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: "Nova Instituição", degree: "Curso/Grau", period: "Período" },
      ],
    }));
  };

  // Remover formação acadêmica
  const removeEducation = (index: number) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((_, idx) => idx !== index),
    }));
  };

  // Sincronizar competências categorizadas
  const handleCategoryNameChange = (index: number, name: string) => {
    setData((prev) => {
      const newSkills = [...prev.skills];
      newSkills[index] = { ...newSkills[index], category: name };
      return { ...prev, skills: newSkills };
    });
  };

  const handleCategoryItemsChange = (index: number, text: string) => {
    const items = text.split(",").map((s) => s.trim()).filter((s) => s !== "");
    setData((prev) => {
      const newSkills = [...prev.skills];
      newSkills[index] = { ...newSkills[index], items };
      return { ...prev, skills: newSkills };
    });
  };

  const addSkillCategory = () => {
    setData((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), { category: "Nova Categoria", items: [] }],
    }));
  };

  const removeSkillCategory = (index: number) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, idx) => idx !== index),
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
    if (score >= 50) return "text-amber-400 border-amber-500/20 bg-amber-500/5";
    return "text-rose-400 border-rose-500/20 bg-rose-500/5";
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-sky-950/40 pb-5">
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
            <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <FileText className="h-6 w-6 text-sky-400" />
              Currículo Otimizado para LinkedIn
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Edite as informações na esquerda e veja o PDF gerado em tempo real na direita.
            </p>
          </div>
        </div>
        {isMounted && (
          <PDFDownloadLink
            document={<CvDocument data={data} />}
            fileName={`${data.metadata.title || "Curriculo_Otimizado"}.pdf`}
          >
            {({ loading }) => (
              <Button
                disabled={loading}
                className="bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-medium shadow-lg shadow-sky-950/50 border border-sky-400/20 px-6 py-2 transition-all flex items-center gap-2"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Baixar PDF
              </Button>
            )}
          </PDFDownloadLink>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className={`border backdrop-blur-md shadow-lg ${getScoreColor(data.scores.geral)}`}>
          <CardContent className="text-center">
            <span className="font-semibold uppercase tracking-wider opacity-80">Score Geral</span>
            <div className="text-4xl font-extrabold mt-2">{data.scores.geral}%</div>
          </CardContent>
        </Card>

        <Card className={`border backdrop-blur-md shadow-lg ${getScoreColor(data.scores.resumo)}`}>
          <CardContent className="text-center">
            <span className="font-semibold uppercase tracking-wider opacity-80">Resumo</span>
            <div className="text-4xl font-extrabold mt-2">{data.scores.resumo}%</div>
          </CardContent>
        </Card>

        <Card className={`border backdrop-blur-md shadow-lg ${getScoreColor(data.scores.experiencia)}`}>
          <CardContent className="text-center">
            <span className="font-semibold uppercase tracking-wider opacity-80">Experiência</span>
            <div className="text-4xl font-extrabold mt-2">{data.scores.experiencia}%</div>
          </CardContent>
        </Card>

        <Card className={`border backdrop-blur-md shadow-lg ${getScoreColor(data.scores.habilidades)}`}>
          <CardContent className="text-center">
            <span className="font-semibold uppercase tracking-wider opacity-80">Habilidades</span>
            <div className="text-4xl font-extrabold mt-2">{data.scores.habilidades}%</div>
          </CardContent>
        </Card>

        <Card className={`border backdrop-blur-md shadow-lg ${getScoreColor(data.scores.cursos)}`}>
          <CardContent className="text-center">
            <span className="font-semibold uppercase tracking-wider opacity-80">Cursos</span>
            <div className="text-4xl font-extrabold mt-2">{data.scores.cursos}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-6 max-h-[90vh] overflow-y-auto pr-2 custom-scrollbar">
          <Collapsible defaultOpen={true}>
            <Card className="border-sky-500/10 bg-slate-900/50 backdrop-blur-md shadow-xl text-slate-200">
              <CollapsibleTrigger className="w-full text-left block">
                <CardHeader className="border-b border-sky-950/30 pb-4 cursor-pointer select-none flex flex-row items-center justify-between group">
                  <div className="space-y-1">
                    <CardTitle className="text-lg text-sky-300">Dados Principais & Metadados do PDF</CardTitle>
                    <CardDescription className="text-slate-400">
                      Estes campos definem as informações de contato principais e o cabeçalho do currículo.
                    </CardDescription>
                  </div>
                  <ChevronDown className="h-5 w-5 text-slate-500 group-data-[state=open]:rotate-180 transition-transform duration-200" />
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4 pt-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="author" className="text-sm font-semibold text-slate-300">Nome do Candidato (Autor)</Label>
                      <Input
                        id="author"
                        value={data.metadata.author}
                        onChange={(e) => handleMetadataChange("author", e.target.value)}
                        className="bg-slate-950/80 border-slate-800 focus:border-sky-500 text-slate-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pdfTitle" className="text-sm font-semibold text-slate-300">Título do Arquivo PDF</Label>
                      <Input
                        id="pdfTitle"
                        value={data.metadata.title}
                        onChange={(e) => handleMetadataChange("title", e.target.value)}
                        className="bg-slate-950/80 border-slate-800 focus:border-sky-500 text-slate-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm font-semibold text-slate-300">Assunto / Cargo Almejado</Label>
                      <Input
                        id="subject"
                        value={data.metadata.subject}
                        onChange={(e) => handleMetadataChange("subject", e.target.value)}
                        className="bg-slate-950/80 border-slate-800 focus:border-sky-500 text-slate-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="keywords" className="text-sm font-semibold text-slate-300">Palavras-chave (Separadas por vírgula)</Label>
                      <Input
                        id="keywords"
                        value={data.metadata.keywords}
                        onChange={(e) => handleMetadataChange("keywords", e.target.value)}
                        className="bg-slate-950/80 border-slate-800 focus:border-sky-500 text-slate-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="headline" className="text-sm font-semibold text-slate-300">Título Profissional (Headline)</Label>
                    <Input
                      id="headline"
                      value={data.headline}
                      onChange={(e) => handleSimpleFieldChange("headline", e.target.value)}
                      className="bg-slate-950/80 border-slate-800 focus:border-sky-500 text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summary" className="text-sm font-semibold text-slate-300">Resumo Profissional</Label>
                    <Textarea
                      id="summary"
                      value={data.summary}
                      rows={4}
                      onChange={(e) => handleSimpleFieldChange("summary", e.target.value)}
                      className="bg-slate-950/80 border-slate-800 focus:border-sky-500 text-slate-100 resize-y"
                    />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible defaultOpen={true}>
            <Card className="border-sky-500/10 bg-slate-900/50 backdrop-blur-md shadow-xl text-slate-200">
              <CollapsibleTrigger className="w-full text-left block">
                <CardHeader className="border-b border-sky-950/30 pb-4 cursor-pointer select-none flex flex-row items-center justify-between group">
                  <div className="space-y-1">
                    <CardTitle className="text-lg text-sky-300">Experiências Profissionais</CardTitle>
                    <CardDescription className="text-slate-400">
                      Descreva suas experiências passadas estruturando os bullet points.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        addExperience();
                      }}
                      className="border-sky-500/30 text-sky-400 hover:bg-sky-950/50 flex items-center gap-1.5"
                    >
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                    <ChevronDown className="h-5 w-5 text-slate-500 group-data-[state=open]:rotate-180 transition-transform duration-200" />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-6 pt-5">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="p-4 rounded-lg bg-slate-950/50 border border-slate-850 space-y-4 relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExperience(index)}
                        className="absolute top-2 right-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-slate-400">Empresa</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                            className="bg-slate-950 border-slate-800 text-slate-100 h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-slate-400">Cargo</Label>
                          <Input
                            value={exp.role}
                            onChange={(e) => handleExperienceChange(index, "role", e.target.value)}
                            className="bg-slate-950 border-slate-800 text-slate-100 h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-slate-400">Período</Label>
                          <Input
                            value={exp.period}
                            onChange={(e) => handleExperienceChange(index, "period", e.target.value)}
                            className="bg-slate-950 border-slate-800 text-slate-100 h-8 text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs text-slate-400">
                          Atividades (Uma por linha. Inicie com verbos de ação e conquistas quantificáveis)
                        </Label>
                        <Textarea
                          defaultValue={exp.bullets.join("\n")}
                          rows={4}
                          onChange={(e) => handleExperienceBulletsChange(index, e.target.value)}
                          className="bg-slate-950 border-slate-800 text-slate-100 text-sm resize-y"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible defaultOpen={true}>
            <Card className="border-sky-500/10 bg-slate-900/50 backdrop-blur-md shadow-xl text-slate-200">
              <CollapsibleTrigger className="w-full text-left block">
                <CardHeader className="border-b border-sky-950/30 pb-4 cursor-pointer select-none flex flex-row items-center justify-between group">
                  <div className="space-y-1">
                    <CardTitle className="text-lg text-sky-300">Competências</CardTitle>
                    <CardDescription className="text-slate-400">
                      Organize suas competências em categorias (ex: Front-end, Back-end).
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        addSkillCategory();
                      }}
                      className="border-sky-500/30 text-sky-400 hover:bg-sky-950/50 flex items-center gap-1.5"
                    >
                      <Plus className="h-4 w-4" /> Add Categoria
                    </Button>
                    <ChevronDown className="h-5 w-5 text-slate-500 group-data-[state=open]:rotate-180 transition-transform duration-200" />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4 pt-5">
                  {data.skills && data.skills.map((cat, index) => (
                    <div key={index} className="p-4 rounded-lg bg-slate-950/50 border border-slate-850 space-y-3 relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSkillCategory(index)}
                        className="absolute top-2 right-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <div className="space-y-1 pr-8">
                        <Label className="text-xs text-slate-400">Nome da Categoria</Label>
                        <Input
                          value={cat.category}
                          onChange={(e) => handleCategoryNameChange(index, e.target.value)}
                          className="bg-slate-950 border-slate-800 text-slate-100 h-8 text-sm"
                          placeholder="Ex: Front-end, Back-end, Soft Skills"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs text-slate-400">Itens (Separados por vírgula)</Label>
                        <Input
                          value={cat.items ? cat.items.join(", ") : ""}
                          onChange={(e) => handleCategoryItemsChange(index, e.target.value)}
                          className="bg-slate-950 border-slate-800 text-slate-100 h-8 text-sm"
                          placeholder="Ex: React, Next.js, HTML, CSS"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible defaultOpen={true}>
            <Card className="border-sky-500/10 bg-slate-900/50 backdrop-blur-md shadow-xl text-slate-200">
              <CollapsibleTrigger className="w-full text-left block">
                <CardHeader className="border-b border-sky-950/30 pb-4 cursor-pointer select-none flex flex-row items-center justify-between group">
                  <div className="space-y-1">
                    <CardTitle className="text-lg text-sky-300">Formação Acadêmica</CardTitle>
                    <CardDescription className="text-slate-400">
                      Cadastre suas formações, cursos acadêmicos ou certificações superiores.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        addEducation();
                      }}
                      className="border-sky-500/30 text-sky-400 hover:bg-sky-950/50 flex items-center gap-1.5"
                    >
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                    <ChevronDown className="h-5 w-5 text-slate-500 group-data-[state=open]:rotate-180 transition-transform duration-200" />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4 pt-5">
                  {data.education.map((edu, index) => (
                    <div key={index} className="p-4 rounded-lg bg-slate-950/50 border border-slate-850 space-y-3 relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEducation(index)}
                        className="absolute top-2 right-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-slate-400">Instituição</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                            className="bg-slate-950 border-slate-800 text-slate-100 h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-slate-400">Curso / Grau</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                            className="bg-slate-950 border-slate-800 text-slate-100 h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-slate-400">Período</Label>
                          <Input
                            value={edu.period}
                            onChange={(e) => handleEducationChange(index, "period", e.target.value)}
                            className="bg-slate-950 border-slate-800 text-slate-100 h-8 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Collapsible>
              <Card className="border-emerald-500/10 bg-emerald-950/5 text-slate-200">
                <CollapsibleTrigger className="w-full text-left block">
                  <CardHeader className="border-b border-emerald-950/20 pb-4 cursor-pointer select-none flex flex-row items-center justify-between group">
                    <div className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4 text-emerald-400" />
                      <CardTitle className="font-semibold text-emerald-300">Itens recomendados para Adicionar</CardTitle>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-500 group-data-[state=open]:rotate-180 transition-transform duration-200" />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-4 space-y-3">
                    {data.thingsToAdd && data.thingsToAdd.length > 0 ? (
                      data.thingsToAdd.map((item, index) => (
                        <div key={index} className="space-y-1 border-b border-emerald-950/20 pb-2 last:border-0 last:pb-0">
                          <h5 className="font-bold text-slate-200">{item.title}</h5>
                          <p className="text-slate-400 leading-normal">{item.reason}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 italic">Nenhuma recomendação de inserção necessária.</p>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <Collapsible>
              <Card className="border-rose-500/10 bg-rose-950/5 text-slate-200">
                <CollapsibleTrigger className="w-full text-left block">
                  <CardHeader className="border-b border-rose-950/20 pb-4 cursor-pointer select-none flex flex-row items-center justify-between group">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-rose-400" />
                      <CardTitle className="font-semibold text-rose-300">Itens recomendados para Remover</CardTitle>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-500 group-data-[state=open]:rotate-180 transition-transform duration-200" />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-4 space-y-3">
                    {data.thingsToRemove && data.thingsToRemove.length > 0 ? (
                      data.thingsToRemove.map((item, index) => (
                        <div key={index} className="space-y-1 border-b border-rose-950/20 pb-2 last:border-0 last:pb-0">
                          <h5 className="font-bold text-slate-200">{item.title}</h5>
                          <p className="text-slate-400 leading-normal">{item.reason}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 italic">Nenhum elemento prejudicial detectado.</p>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>

        </div>

        <div className="flex flex-col gap-4 lg:sticky lg:top-8">
          <Card className="border-sky-500/10 bg-slate-900/50 backdrop-blur-md shadow-xl text-slate-200 overflow-hidden">
            <CardHeader className="border-b border-sky-950/30 pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg text-sky-300">Visualização do PDF</CardTitle>
                <CardDescription className="text-slate-400">
                  Veja como ficará a formatação final do currículo.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isMounted ? (
                <div className="w-full h-[65vh] bg-slate-950/30">
                  <PDFViewer className="w-full h-full border-0" showToolbar={true}>
                    <CvDocument data={data} />
                  </PDFViewer>
                </div>
              ) : (
                <div className="w-full h-[65vh] flex items-center justify-center bg-slate-950/50">
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="h-8 w-8 animate-spin text-sky-400" />
                    <span className="text-sm text-slate-400">Carregando Visualização...</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
