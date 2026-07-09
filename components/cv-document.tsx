import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { OptimizedLinkedinResult } from "@/app/actions/optimize";

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 40,
    paddingVertical: 45,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: "#000000",
    lineHeight: 1.45,
  },
  header: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 6,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    letterSpacing: 0.5,
  },
  headline: {
    fontSize: 10.5,
    color: "#333333",
    marginTop: 12,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000000",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 2,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summary: {
    marginBottom: 8,
    textAlign: "justify",
  },
  experienceItem: {
    marginBottom: 10,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  companyRole: {
    fontWeight: "bold",
    color: "#000000",
    fontSize: 10,
  },
  period: {
    color: "#333333",
    fontSize: 9,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 6,
  },
  bullet: {
    width: 8,
    fontSize: 9.5,
  },
  bulletText: {
    flex: 1,
    textAlign: "justify",
  },
  categoryBold: {
    fontWeight: "bold",
  },
  educationItem: {
    marginBottom: 6,
  },
  educationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  institution: {
    fontWeight: "bold",
    color: "#000000",
  },
});

interface CvDocumentProps {
  data: OptimizedLinkedinResult;
}

export const CvDocument: React.FC<CvDocumentProps> = ({ data }) => {
  const { metadata, headline, summary, experience, skills, education } = data;

  return (
    <Document
      title={metadata.title || "Curriculo_Otimizado"}
      creator={metadata.creator || "Nome do Candidato"}
      author={metadata.creator || "Nome do Candidato"}
      keywords={metadata.keywords || "ATS, resume, currículo"}
      subject={metadata.description || "Curriculo Otimizado para ATS"}
      producer={metadata.creator || "Nome do Candidato"}
    >
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.name}>{metadata.creator || "Nome do Candidato"}</Text>
          {headline && <Text style={styles.headline}>{headline}</Text>}
        </View>

        {/* Resumo Profissional */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumo Profissional</Text>
            <Text style={styles.summary}>{summary}</Text>
          </View>
        )}

        {/* Experiência Profissional */}
        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experiência Profissional</Text>
            {experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.companyRole}>
                    {exp.role} — {exp.company}
                  </Text>
                  <Text style={styles.period}>{exp.period}</Text>
                </View>
                {exp.bullets &&
                  exp.bullets.map((bullet, bIdx) => (
                    <View key={bIdx} style={styles.bulletPoint}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
              </View>
            ))}
          </View>
        )}

        {/* Competências */}
        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Principais Competências</Text>
            {skills.map((cat, index) => (
              <View key={index} style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>
                  <Text style={styles.categoryBold}>{cat.category}: </Text>
                  {cat.items && cat.items.join(", ")}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Formação Acadêmica */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Formação Acadêmica</Text>
            {education.map((edu, index) => (
              <View key={index} style={styles.educationItem}>
                <View style={styles.educationHeader}>
                  <Text style={styles.institution}>
                    {edu.degree} — {edu.institution}
                  </Text>
                  <Text style={styles.period}>{edu.period}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};
