"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircleIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { Transition } from "@headlessui/react";
import { z } from "zod";

type LanguageCode = "Français" | "Anglais" | "Espagnol";
type Sector = "Marketing" | "Technologies" | "Finance" | "Design";
type Level = "Débutant" | "Intermédiaire" | "Senior";

const formSchema = z.object({
  name: z.string().min(2),
  language: z.enum(["Français", "Anglais", "Espagnol"]),
  keywords: z.string().min(2),
  sector: z.enum(["Marketing", "Technologies", "Finance", "Design"]),
  experienceLevel: z.enum(["Débutant", "Intermédiaire", "Senior"]),
  careerGoal: z.string().optional(),
  internshipRole: z.string().optional(),
  internshipSkills: z.string().optional(),
  responsibilities: z.string().optional(),
  internshipDuration: z.string().optional()
});

const languageCopy: Record<
  LanguageCode,
  {
    intro: string;
    title: string;
    keywordsLabel: string;
    feedbackTitle: string;
    callToAction: string;
  }
> = {
  Français: {
    intro:
      "Mettez en avant vos compétences grâce à une description orientée recruteurs et systèmes ATS.",
    title: "Agent Création Profil CV",
    keywordsLabel: "Mots-clés suggérés",
    feedbackTitle: "Commentaires",
    callToAction: "Générer la description"
  },
  Anglais: {
    intro:
      "Highlight your strengths with a recruiter and ATS-focused profile summary.",
    title: "CV Profile Generator",
    keywordsLabel: "Suggested Keywords",
    feedbackTitle: "Feedback",
    callToAction: "Generate description"
  },
  Espagnol: {
    intro:
      "Resalta tus competencias con una descripción optimizada para reclutadores y sistemas ATS.",
    title: "Generador de Perfil CV",
    keywordsLabel: "Palabras clave sugeridas",
    feedbackTitle: "Comentarios",
    callToAction: "Generar descripción"
  }
};

const features = [
  "Sélection de la langue",
  "Choix des mots-clés",
  "Adaptabilité au secteur",
  "Optimisation pour les recruteurs et ATS",
  "Compétences acquises en stage",
  "Personnalisation selon le poste"
];

const generationSteps = [
  {
    step: 1,
    title: "Collecte des infos personnelles et professionnelles",
    details:
      "Nom, Langue, Mots-clés, Secteur, Niveau d'expérience, Objectif de carrière."
  },
  {
    step: 2,
    title: "Collecte des informations de stage ou expérience professionnelle",
    details:
      "Stage ou Expérience, Compétences acquises, Responsabilités, Durée."
  },
  {
    step: 3,
    title: "Génération de la description de profil",
    details:
      "L'AI génère la description basée sur les informations fournies et les attentes du secteur."
  },
  {
    step: 4,
    title: "Suggestions d'ajustements",
    details:
      "Mots-clés complémentaires et axes d'amélioration spécifiques au secteur."
  }
];

type GeneratedResult = {
  description: string;
  keywords: string[];
  feedback: string[];
};

const sectorFocus: Record<Sector, Record<LanguageCode, string[]>> = {
  Marketing: {
    Français: [
      "stratégies digitales",
      "analyse de données marketing",
      "campagnes multicanales"
    ],
    Anglais: ["digital strategies", "marketing data analysis", "multichannel campaigns"],
    Espagnol: [
      "estrategias digitales",
      "análisis de datos de marketing",
      "campañas multicanal"
    ]
  },
  Technologies: {
    Français: ["agilité", "collaboration DevOps", "sécurité applicative"],
    Anglais: ["agility", "DevOps collaboration", "application security"],
    Espagnol: ["agilidad", "colaboración DevOps", "seguridad de aplicaciones"]
  },
  Finance: {
    Français: ["analyse financière", "gestion des risques", "reporting précis"],
    Anglais: ["financial analysis", "risk management", "accurate reporting"],
    Espagnol: ["análisis financiero", "gestión de riesgos", "reportes precisos"]
  },
  Design: {
    Français: ["expérience utilisateur", "cohérence visuelle", "prototypage"],
    Anglais: ["user experience", "visual consistency", "prototyping"],
    Espagnol: ["experiencia de usuario", "coherencia visual", "prototipado"]
  }
};

const levelImpact: Record<LanguageCode, Record<Level, string>> = {
  Français: {
    Débutant:
      "Mettre en avant la capacité d'apprentissage rapide et l'envie de contribuer sur des projets concrets.",
    Intermédiaire:
      "Souligner l'autonomie sur des missions variées et la contribution à des résultats mesurables.",
    Senior:
      "Repositionner les réalisations clés et l'impact stratégique sur l'équipe et l'organisation."
  },
  Anglais: {
    Débutant:
      "Emphasize a fast learning curve and motivation to support tangible initiatives.",
    Intermédiaire:
      "Underline autonomy across diverse missions and measurable contributions.",
    Senior:
      "Highlight strategic achievements and the broader impact on teams and stakeholders."
  },
  Espagnol: {
    Débutant:
      "Destaca la rápida curva de aprendizaje y el deseo de aportar en proyectos concretos.",
    Intermédiaire:
      "Resalta la autonomía en misiones variadas y la contribución con resultados medibles.",
    Senior:
      "Enfatiza los logros estratégicos y el impacto amplio en el equipo y la organización."
  }
};

const keywordBoosters: Record<Sector, string[]> = {
  Marketing: [
    "growth marketing",
    "SEO/SEA",
    "marketing automation",
    "brand storytelling"
  ],
  Technologies: ["architecture scalable", "microservices", "CI/CD", "cloud"],
  Finance: [
    "modélisation financière",
    "optimisation budgétaire",
    "compliance",
    "due diligence"
  ],
  Design: [
    "design thinking",
    "design system",
    "accessibilité",
    "recherche utilisateur"
  ]
};

const levelVocabulary: Record<LanguageCode, Record<Level, string>> = {
  Français: {
    Débutant: "profil débutant",
    Intermédiaire: "profil intermédiaire",
    Senior: "profil senior"
  },
  Anglais: {
    Débutant: "junior profile",
    Intermédiaire: "mid-level background",
    Senior: "senior profile"
  },
  Espagnol: {
    Débutant: "perfil junior",
    Intermédiaire: "perfil intermedio",
    Senior: "perfil senior"
  }
};

const sectorVocabulary: Record<LanguageCode, Record<Sector, string>> = {
  Français: {
    Marketing: "marketing",
    Technologies: "technologies",
    Finance: "finance",
    Design: "design"
  },
  Anglais: {
    Marketing: "marketing",
    Technologies: "technology",
    Finance: "finance",
    Design: "design"
  },
  Espagnol: {
    Marketing: "marketing",
    Technologies: "tecnología",
    Finance: "finanzas",
    Design: "diseño"
  }
};

const feedbackGeneral: Record<LanguageCode, string> = {
  Français:
    "Ajouter des preuves chiffrées alignées sur le secteur pour renforcer la crédibilité.",
  Anglais:
    "Add quantified evidence aligned with the sector to reinforce credibility.",
  Espagnol:
    "Añade indicadores cuantificables alineados con el sector para reforzar la credibilidad."
};

const keywordInstruction: Record<LanguageCode, string> = {
  Français:
    "Insérer les mots-clés suggérés dans les sections compétences et expériences.",
  Anglais: "Inject the suggested keywords into the skills and experience sections.",
  Espagnol:
    "Incorpora las palabras clave sugeridas en las secciones de habilidades y experiencia."
};

function generateNarrative(form: z.infer<typeof formSchema>): GeneratedResult {
  const keywordList = form.keywords
    .split(/[,;]/)
    .map((k) => k.trim())
    .filter(Boolean);

  const language = form.language;

  const extraKeywords = keywordBoosters[form.sector].filter(
    (kw) => !keywordList.some((existing) => existing.toLowerCase() === kw.toLowerCase())
  );

  const allKeywords = [...keywordList, ...extraKeywords.slice(0, 3)];

  const stageDetails =
    form.internshipRole || form.internshipSkills || form.responsibilities
      ? `${form.internshipRole ? `${form.internshipRole}` : ""}${
          form.internshipDuration ? ` (${form.internshipDuration})` : ""
        }`
      : "";

  const responsibilities = [
    form.internshipSkills,
    form.responsibilities,
    sectorFocus[form.sector][language].join(", ")
  ]
    .filter(Boolean)
    .join(". ");

  const localizedLevel = levelVocabulary[language][form.experienceLevel];
  const sectorLabel = sectorVocabulary[language][form.sector];

  const localizedDescriptions: Record<LanguageCode, string> = {
    Français: [
      `${form.name} valorise ${keywordList.slice(0, 3).join(", ")} avec un ${localizedLevel} en ${sectorLabel}.`,
      form.careerGoal
        ? `Objectif : ${form.careerGoal.trim()}.`
        : "Objectif : créer de la valeur mesurable pour l'équipe.",
      stageDetails
        ? `Expérience marquante : ${stageDetails}.`
        : "Expérience marquante : participation active à des projets impactants.",
      responsibilities
        ? `Responsabilités principales : ${responsibilities}.`
        : "Responsabilités principales : coordination, collaboration et suivi rigoureux."
    ].join(" "),
    Anglais: [
      `${form.name} leverages ${keywordList.slice(0, 3).join(", ")} with a ${localizedLevel} in ${sectorLabel}.`,
      form.careerGoal
        ? `Career goal: ${form.careerGoal.trim()}.`
        : "Career goal: drive measurable impact across the organization.",
      stageDetails
        ? `Key experience: ${stageDetails}.`
        : "Key experience: delivering results across collaborative projects.",
      responsibilities
        ? `Core responsibilities: ${responsibilities}.`
        : "Core responsibilities: coordination, stakeholder alignment, rigorous follow-up."
    ].join(" "),
    Espagnol: [
      `${form.name} destaca en ${keywordList.slice(0, 3).join(", ")} con un ${localizedLevel} en ${sectorLabel}.`,
      form.careerGoal
        ? `Objetivo profesional: ${form.careerGoal.trim()}.`
        : "Objetivo profesional: generar impacto medible dentro del equipo.",
      stageDetails
        ? `Experiencia clave: ${stageDetails}.`
        : "Experiencia clave: participación en iniciativas multidisciplinarias.",
      responsibilities
        ? `Responsabilidades principales: ${responsibilities}.`
        : "Responsabilidades principales: coordinación, colaboración y control de calidad."
    ].join(" ")
  };

  const feedback: string[] = [
    levelImpact[language][form.experienceLevel],
    feedbackGeneral[language],
    keywordInstruction[language]
  ];

  return {
    description: localizedDescriptions[language],
    keywords: allKeywords,
    feedback
  };
}

export default function Page() {
  const [formState, setFormState] = useState({
    name: "",
    language: "Français" as LanguageCode,
    keywords: "",
    sector: "Marketing" as Sector,
    experienceLevel: "Débutant" as Level,
    careerGoal: "",
    internshipRole: "",
    internshipSkills: "",
    responsibilities: "",
    internshipDuration: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [isGenerated, setIsGenerated] = useState(false);

  const copy = useMemo(() => languageCopy[formState.language], [formState.language]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const safeParse = formSchema.safeParse(formState);

    if (!safeParse.success) {
      const fieldErrors: Record<string, string> = {};
      safeParse.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      setIsGenerated(false);
      return;
    }

    setErrors({});
    const generated = generateNarrative(safeParse.data);
    setResult(generated);
    setIsGenerated(true);
  };

  const handleChange = (
    field: keyof typeof formState,
    value: string
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen gradient-bg">
      <header className="mx-auto flex max-w-5xl flex-col gap-6 px-6 pb-16 pt-16 text-center">
        <span className="mx-auto rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          Agent AI • Profil CV
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          {copy.title}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">{copy.intro}</p>
        <div className="mx-auto flex flex-wrap justify-center gap-3 text-sm">
          {features.map((feature) => (
            <span
              key={feature}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-slate-700 shadow-sm"
            >
              <CheckCircleIcon className="h-4 w-4 text-primary" />
              {feature}
            </span>
          ))}
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-6 pb-24 md:grid-cols-[3fr,2fr]">
        <section className="flex flex-col gap-6 rounded-3xl bg-white/80 p-8 shadow-lg ring-1 ring-slate-100 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Formulaire de Profil CV
              </h2>
              <p className="text-sm text-slate-500">
                Remplissez ce formulaire pour générer votre description de profil CV.
              </p>
            </div>
            <SparklesIcon className="h-8 w-8 text-primary" />
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <FormField
              label="Nom"
              required
              input={
                <input
                  className="field"
                  placeholder="Entrez votre nom"
                  value={formState.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                />
              }
              error={errors.name}
            />

            <FormField
              label="Langue"
              required
              input={
                <select
                  className="field"
                  value={formState.language}
                  onChange={(event) =>
                    handleChange("language", event.target.value)
                  }
                >
                  <option>Français</option>
                  <option>Anglais</option>
                  <option>Espagnol</option>
                </select>
              }
              error={errors.language}
            />

            <FormField
              label="Mots-clés (Compétences)"
              required
              helper="Séparez chaque mot-clé par une virgule."
              input={
                <input
                  className="field"
                  placeholder="marketing digital, JavaScript"
                  value={formState.keywords}
                  onChange={(event) =>
                    handleChange("keywords", event.target.value)
                  }
                />
              }
              error={errors.keywords}
            />

            <div className="grid gap-5 sm:grid-cols-3">
              <FormField
                label="Secteur"
                required
                input={
                  <select
                    className="field"
                    value={formState.sector}
                    onChange={(event) =>
                      handleChange("sector", event.target.value)
                    }
                  >
                    <option>Marketing</option>
                    <option>Technologies</option>
                    <option>Finance</option>
                    <option>Design</option>
                  </select>
                }
                error={errors.sector}
              />

              <FormField
                label="Niveau d'expérience"
                required
                input={
                  <select
                    className="field"
                    value={formState.experienceLevel}
                    onChange={(event) =>
                      handleChange("experienceLevel", event.target.value)
                    }
                  >
                    <option>Débutant</option>
                    <option>Intermédiaire</option>
                    <option>Senior</option>
                  </select>
                }
                error={errors.experienceLevel}
              />

              <FormField
                label="Durée du stage"
                input={
                  <input
                    className="field"
                    placeholder="Ex: Juin 2023 - Août 2023"
                    value={formState.internshipDuration}
                    onChange={(event) =>
                      handleChange("internshipDuration", event.target.value)
                    }
                  />
                }
                error={errors.internshipDuration}
              />
            </div>

            <FormField
              label="Objectif de carrière"
              input={
                <textarea
                  className="field min-h-[120px]"
                  placeholder="Objectifs professionnels"
                  value={formState.careerGoal}
                  onChange={(event) =>
                    handleChange("careerGoal", event.target.value)
                  }
                />
              }
              error={errors.careerGoal}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Stage ou Expérience"
                input={
                  <input
                    className="field"
                    placeholder="Fonction de stage"
                    value={formState.internshipRole}
                    onChange={(event) =>
                      handleChange("internshipRole", event.target.value)
                    }
                  />
                }
                error={errors.internshipRole}
              />

              <FormField
                label="Compétences acquises"
                input={
                  <input
                    className="field"
                    placeholder="Compétences du stage"
                    value={formState.internshipSkills}
                    onChange={(event) =>
                      handleChange("internshipSkills", event.target.value)
                    }
                  />
                }
                error={errors.internshipSkills}
              />
            </div>

            <FormField
              label="Responsabilités"
              input={
                <textarea
                  className="field min-h-[120px]"
                  placeholder="Responsabilités principales"
                  value={formState.responsibilities}
                  onChange={(event) =>
                    handleChange("responsibilities", event.target.value)
                  }
                />
              }
              error={errors.responsibilities}
            />

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:scale-[1.01] hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <SparklesIcon className="h-5 w-5" />
              {copy.callToAction}
            </button>
          </form>
        </section>

        <aside className="flex flex-col gap-6">
          <section className="rounded-3xl bg-white/80 p-7 shadow-md ring-1 ring-slate-100 backdrop-blur">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">
              Processus de génération
            </h3>
            <ol className="flex flex-col gap-4 text-sm text-slate-600">
              {generationSteps.map((step) => (
                <li
                  key={step.step}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                      Étape {step.step}
                    </span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {step.step}
                    </span>
                  </div>
                  <p className="mt-2 font-medium text-slate-900">{step.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{step.details}</p>
                </li>
              ))}
            </ol>
          </section>

          <Transition
            show={isGenerated && !!result}
            enter="transition-all duration-300"
            enterFrom="opacity-0 translate-y-4"
            enterTo="opacity-100 translate-y-0"
          >
            {result && (
              <section className="flex flex-col gap-5 rounded-3xl bg-slate-900 p-7 text-slate-50 shadow-xl">
                <div>
                  <h3 className="text-lg font-semibold">
                    Description de Profil
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">
                    {result.description}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-secondary">
                    {languageCopy[formState.language].keywordsLabel}
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-200"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-secondary">
                    {languageCopy[formState.language].feedbackTitle}
                  </h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-300">
                    {result.feedback.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </section>
            )}
          </Transition>
        </aside>
      </main>
    </div>
  );
}

type FormFieldProps = {
  label: string;
  required?: boolean;
  input: React.ReactNode;
  error?: string;
  helper?: string;
};

function FormField({ label, required, input, error, helper }: FormFieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
      <span>
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
      </span>
      {input}
      {helper && <span className="text-xs font-normal text-slate-500">{helper}</span>}
      {error && <span className="text-xs font-normal text-red-500">{error}</span>}
    </label>
  );
}
