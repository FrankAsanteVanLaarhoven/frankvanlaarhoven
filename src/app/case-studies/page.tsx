"use client";

import Link from "next/link";

const PROJECTS = [
  {
    id: "quantx",
    title: "QuantX OS",
    status: "LIVE — v1.0.0-dev",
    stack: "FastAPI · Next.js · AWS ECS Fargate · RDS PostgreSQL · CloudFront · Terraform · CI/CD",
    summary:
      "Production financial signal platform providing walk-forward ML-based signal generation, portfolio risk simulation, and a ranked eToro universe of 61 tickers.",
    evidence: [
      "72 pytest tests passing · 11 Playwright E2E panel tests passing",
      "TypeScript zero-error build · Trivy scan: no CRITICAL/HIGH",
      "AWS ECS Fargate (0.5 vCPU / 1 GB) · RDS PostgreSQL 15.13 · CloudFront CDN",
      "Terraform dev/staging/prod module structure",
      "Alpha Model Factory: LogisticRegression + RF + GBT ensemble, 5-fold walk-forward, 18bps cost, OOS AUC gate",
      "Portfolio Digital Twin: 90-day Pearson correlation, 6 historical stress scenarios",
      "CI/CD gate: TypeScript build + pytest + Docker build + Trivy + Playwright → ECR push → ECS deploy",
      "v1.0.0-dev tagged · backend live at d3njafiqr9fzgp.cloudfront.net · dev cost ~£25/month",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/FrankAsanteVanLaarhoven/QuantX" },
    ],
  },
  {
    id: "infraconnect",
    title: "InfraConnect AI",
    status: "RELEASED — v1 RC4",
    stack: "Python · ROS2 · Isaac Sim · Gazebo · MuJoCo · REST · Kafka · S3 · Helm · Kubernetes",
    summary:
      "Execution-time spatial safety layer for multi-environment robotic systems. ExecutionGuard is synchronous and sits on the action path — unsafe commands are blocked before reaching any publisher or controller.",
    evidence: [
      "205/205 tests passing · 43/43 connector tests passing",
      "Helm render clean — all manifests validate against Kubernetes schema",
      "ExecutionGuard: velocity limits, obstacle clearance, prohibited regions, emergency stop",
      "SAFE_HALT / EMERGENCY_STOP as action-path decisions — not advisory warnings",
      "Connector fabric: REST, SFTP, SOAP, Kafka, S3, ROS2 bridge — all route through same guard",
      "Simulation interceptors: ROS2, Isaac Sim, Gazebo, MuJoCo — identical enforcement",
      "Replay evidence: JSON, Markdown, CSV traceability matrix for certification",
      "Deploy evidence: GitHub OIDC plan, v1 release readiness checklist, validation report",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/FrankAsanteVanLaarhoven/infraconnect-ai" },
    ],
  },
  {
    id: "fleetsafe",
    title: "FleetSafe / GNM-VLNVerse",
    status: "ACTIVE RESEARCH",
    stack: "Isaac Sim · ROS2 · Python · W&B · HuggingFace · VLNVerse · Yahboom M3Pro",
    summary:
      "Reproducible GNM baseline for visual goal navigation on VLNVerse/Kujiale indoor scenes within Isaac Sim. Provides trajectory validation, RGB-pose evidence, and GNM-format conversion for the hospital navigation benchmark.",
    evidence: [
      "238 training trajectories · 15 validation trajectories across 4 VLNVerse/Kujiale scenes",
      "GNM input format validated: current RGB image paired with goal RGB image",
      "Trajectory pose validation from traj_data.pkl: position (T, 2) and yaw (T,) arrays",
      "Local waypoint derivation: positions[i + horizon] − positions[i] rotated into robot frame",
      "Live dashboard export (PIL): start / current / goal state at every step",
      "Manual Isaac Sim test-drive recording: per-step RGB, pose, and action logging",
      "GNM-format conversion with protected-directory safety guard",
      "CustomVLN-Office scene as proof-of-method (no VLNVerse assets required)",
      "W&B project: fleetsafe-hospitalnav · HuggingFace: frankleroyvan",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/FrankAsanteVanLaarhoven/gnm-vlnverse-baseline" },
      { label: "W&B", href: "https://wandb.ai/f-van-laarhoven2-newcastle-ac-uk/fleetsafe-hospitalnav" },
      { label: "HuggingFace", href: "https://huggingface.co/frankleroyvan" },
    ],
  },
  {
    id: "petclinic",
    title: "PetClinic Cloud DevOps",
    status: "INFRASTRUCTURE COMPLETE",
    stack: "EKS 1.29 · ArgoCD · Helm · Terraform · RDS MySQL 8.0 · ALB · GitHub Actions · Karpenter",
    summary:
      "AWS cloud-native deployment platform for Spring Petclinic Microservices — 8 Spring Boot services on EKS Graviton nodes, with GitOps delivery via ArgoCD and Terraform-managed infrastructure.",
    evidence: [
      "8 Spring Boot services: config-server, discovery-server, api-gateway, customers, visits, vets, genai, admin",
      "EKS 1.29 with Graviton (ARM64) node group, OIDC provider, Karpenter Spot autoscaling",
      "RDS MySQL 8.0 · random_password → AWS Secrets Manager · ExternalSecret operator",
      "Terraform: 8 modules (vpc, eks, ecr, rds, secrets, dns, github-oidc, karpenter, observability)",
      "S3 + DynamoDB Terraform state backend with locking and AES256 encryption",
      "Generic Helm chart shared by all 8 services: HPA, PDB, IRSA support, init containers for startup ordering",
      "ArgoCD Application CRDs for dev and prod environments",
      "GitHub Actions OIDC-based CI: image build → ECR push → yq tag patch → git commit → ArgoCD sync",
      "ALB controller with Route 53 hosted zone and ACM wildcard certificate",
    ],
    links: [
      { label: "Platform repo", href: "https://github.com/FrankAsanteVanLaarhoven/petclinic-platform" },
      { label: "App repo", href: "https://github.com/FrankAsanteVanLaarhoven/spring-petclinic-microservices" },
    ],
  },
];

const TAG_COLORS: Record<string, string> = {
  "LIVE — v1.0.0-dev": "#00ff9d",
  "RELEASED — v1 RC4": "#00ccff",
  "ACTIVE RESEARCH": "#7d5fff",
  "INFRASTRUCTURE COMPLETE": "#FFA500",
};

export default function CaseStudiesPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#e0e0e0",
        fontFamily: "monospace",
        padding: "60px 24px",
      }}
    >
      {/* Back link */}
      <div style={{ marginBottom: "40px" }}>
        <Link
          href="/"
          style={{
            color: "#00ff9d",
            textDecoration: "none",
            fontSize: "0.85rem",
            letterSpacing: "2px",
            textTransform: "uppercase",
            border: "1px solid rgba(0,255,157,0.3)",
            padding: "6px 16px",
            backdropFilter: "blur(10px)",
          }}
        >
          &larr; RETURN_TO_NEXUS
        </Link>
      </div>

      {/* Header */}
      <header style={{ marginBottom: "60px", maxWidth: "800px" }}>
        <h1
          style={{
            fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#fff",
            marginBottom: "12px",
          }}
        >
          ENGINEERING_CASE_STUDIES
        </h1>
        <p style={{ opacity: 0.6, fontSize: "0.9rem", lineHeight: 1.7 }}>
          Verified projects — real code, tests, and deployment evidence only.
          No placeholders. No unverified claims.
        </p>
        <div
          style={{
            marginTop: "16px",
            padding: "10px 14px",
            border: "1px solid rgba(0,255,157,0.2)",
            background: "rgba(0,255,157,0.03)",
            fontSize: "0.8rem",
            color: "#00ff9d",
            letterSpacing: "1px",
          }}
        >
          POLICY: Only projects with code, tests, deployment reports, or research
          evidence appear here.
        </div>
      </header>

      {/* Project cards */}
      <div
        style={{
          display: "grid",
          gap: "40px",
          maxWidth: "900px",
        }}
      >
        {PROJECTS.map((p) => (
          <section
            key={p.id}
            id={p.id}
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.02)",
              padding: "32px",
              backdropFilter: "blur(8px)",
              scrollMarginTop: "80px",
            }}
          >
            {/* Title row */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                flexWrap: "wrap",
                marginBottom: "12px",
              }}
            >
              <h2
                style={{
                  fontSize: "1.15rem",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "#fff",
                  margin: 0,
                }}
              >
                {p.title}
              </h2>
              <span
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "1px",
                  padding: "3px 10px",
                  border: `1px solid ${TAG_COLORS[p.status] ?? "#aaa"}`,
                  color: TAG_COLORS[p.status] ?? "#aaa",
                  whiteSpace: "nowrap",
                }}
              >
                {p.status}
              </span>
            </div>

            {/* Stack */}
            <p style={{ fontSize: "0.78rem", opacity: 0.5, marginBottom: "14px" }}>
              {p.stack}
            </p>

            {/* Summary */}
            <p style={{ fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "20px" }}>
              {p.summary}
            </p>

            {/* Evidence list */}
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "2px",
                  color: "#00ff9d",
                  marginBottom: "10px",
                  textTransform: "uppercase",
                }}
              >
                Evidence
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gap: "6px",
                }}
              >
                {p.evidence.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: "0.82rem",
                      opacity: 0.75,
                      paddingLeft: "16px",
                      position: "relative",
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        color: "#00ff9d",
                      }}
                    >
                      &gt;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {p.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "0.75rem",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    color: "#00ff9d",
                    textDecoration: "none",
                    border: "1px solid rgba(0,255,157,0.4)",
                    padding: "5px 14px",
                    background: "rgba(0,255,157,0.05)",
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer rule */}
      <footer
        style={{
          marginTop: "80px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: "20px",
          fontSize: "0.75rem",
          opacity: 0.4,
          letterSpacing: "1px",
          maxWidth: "900px",
        }}
      >
        FRANK VAN LAARHOVEN · ROBOTICS / AI ASSURANCE / CLOUD DEVOPS
      </footer>
    </main>
  );
}
