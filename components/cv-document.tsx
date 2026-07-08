import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { OptimizedLinkedinResult } from "@/app/actions/optimize";

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 40,
    paddingVertical: 45,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: "#333333",
    lineHeight: 1.45,
  },
  header: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#0284c7",
    paddingBottom: 6,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
    letterSpacing: 0.5,
  },
  headline: {
    fontSize: 10.5,
    color: "#0284c7",
    marginTop: 2,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f172a",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
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
    color: "#0f172a",
    fontSize: 10,
  },
  period: {
    color: "#64748b",
    fontSize: 9,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 1.5,
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
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillText: {
    fontSize: 9,
    color: "#334155",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginRight: 4,
    marginBottom: 4,
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
    color: "#0f172a",
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
      author={metadata.author || "ATS Optimizer"}
      subject={metadata.subject || "Curriculo Otimizado para ATS"}
      keywords={metadata.keywords || "ATS, resume, currículo"}
    >
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.name}>{metadata.author || "Nome do Candidato"}</Text>
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
              <View key={index} style={{ marginBottom: 5 }}>
                <Text style={{ fontWeight: "bold", fontSize: 9, color: "#1e293b", marginBottom: 2 }}>
                  {cat.category}
                </Text>
                <View style={styles.skillsContainer}>
                  {cat.items && cat.items.map((skill, idx) => (
                    <Text key={idx} style={styles.skillText}>
                      {skill}
                    </Text>
                  ))}
                </View>
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
