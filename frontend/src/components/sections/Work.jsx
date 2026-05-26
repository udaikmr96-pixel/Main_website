import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp, Users, Workflow, Zap } from "lucide-react";

const CASES = [
  {
    id: "hr-ops",
    overline: "Case 01 · HR Operations & Engagement",
    kicker: "HR Senior Executive engagement",
    title:
      "Automated 90% of an HR Senior Executive's KRAs across payroll, onboarding & offboarding.",
    paragraphs: [
      "The brief on paper was simple: payroll, onboarding, offboarding, engagement programs, recruiter coordination and reporting. In practice it was a sprawling, manual mess that ate the workday.",
      "Within the first quarter, ~90% of those KRAs were running on automated workflows — freeing the human time for the bits that actually moved the needle: people, judgement, and exceptions.",
    ],
    scope: [
      "Payroll automation — cycle time cut from days to hours",
      "Onboarding flows — paperwork, access, comms triggered from a single form",
      "Offboarding — exit checklist, asset recovery and revocations on rails",
      "Engagement programs — reminders, surveys & follow-ups automated",
      "Reporting — single dashboard replacing weekly spreadsheets",
    ],
    highlights: [
      { icon: Workflow, metric: "90%", label: "of HR KRAs automated" },
      { icon: Zap, metric: "Days → hrs", label: "payroll cycle time" },
      { icon: Users, metric: "1", label: "operator, end-to-end" },
      { icon: TrendingUp, metric: "0", label: "missed onboardings" },
    ],
    stack: ["Zapier", "n8n", "Google Workspace", "Slack", "Payroll software", "Custom scripts"],
  },
  {
    id: "project-mgmt",
    overline: "Case 02 · Project Management",
    kicker: "Promoted into PM ownership",
    title:
      "Shipped a CRM in 2 months, fixed the ATS, and gave the org direction.",
    paragraphs: [
      "The mandate then expanded into Project Management. Two months later, the CRM was live end-to-end — vendor chosen, data migrated, teams trained.",
      "An extra program for recruiter job posts went live, the ATS was brought back on track, and the broader team got clear consultative direction on how to operate week to week.",
    ],
    scope: [
      "CRM launch — vendor selection, data model, migration & go-live in 8 weeks",
      "Recruiter job-posting program — multi-channel pipeline with templated briefs",
      "ATS rehabilitation — pipeline hygiene, stage definitions, reporting restored",
      "Consultative direction — quarterly OKRs and operating cadence for the team",
      "Cross-functional reviews — finance, ops & talent aligned on one calendar",
    ],
    highlights: [
      { icon: Zap, metric: "2 months", label: "to ship a full CRM" },
      { icon: TrendingUp, metric: "ATS", label: "back on track" },
      { icon: Workflow, metric: "1 program", label: "for recruiter job posts launched" },
      { icon: Users, metric: "Org-wide", label: "operating cadence set" },
    ],
    stack: ["CRM", "ATS", "Job boards", "Notion", "Google Sheets", "Reporting"],
  },
];

function CaseCard({ c, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7 }}
      data-testid={`case-study-${c.id}`}
      className="border border-white/10 bg-[#0a0a0a]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-white/10">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-neutral-500">
            <span className="block w-6 h-px bg-neutral-500" />
            {c.kicker}
          </div>
          <h3 className="font-display mt-6 text-3xl md:text-4xl tracking-tight font-medium leading-tight">
            {c.title}
          </h3>
          <div className="mt-8 space-y-5 text-neutral-300 leading-relaxed text-[15px]">
            {c.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-10">
            <div className="text-xs uppercase tracking-[0.25em] text-neutral-500 mb-4">
              Scope delivered
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {c.scope.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-3 text-sm text-neutral-300"
                >
                  <span className="mt-2 block w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <a
            href="#contact"
            data-testid={`case-cta-${c.id}`}
            className="mt-12 inline-flex items-center gap-3 text-sm font-medium px-6 py-3 border border-white/20 hover:border-white hover:bg-white hover:text-black transition-all rounded-full"
          >
            Tell us a similar story
            <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="lg:col-span-5 p-8 md:p-12 lg:p-16 bg-[#080808]">
          <div className="text-xs uppercase tracking-[0.25em] text-neutral-500 mb-8">
            Impact at a glance
          </div>
          <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10">
            {c.highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <motion.div
                  key={h.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  data-testid={`case-${c.id}-highlight-${i}`}
                  className="bg-[#0a0a0a] p-6 md:p-8"
                >
                  <Icon size={18} className="text-neutral-500 mb-4" />
                  <div className="font-display text-2xl md:text-3xl font-light tracking-tight">
                    {h.metric}
                  </div>
                  <div className="mt-2 text-xs text-neutral-400 leading-relaxed">
                    {h.label}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-10 pt-8 border-t border-white/10">
            <div className="text-xs uppercase tracking-[0.25em] text-neutral-500 mb-4">
              Stack engaged
            </div>
            <div className="flex flex-wrap gap-2">
              {c.stack.map((t) => (
                <span
                  key={t}
                  className="text-xs text-neutral-300 px-3 py-1.5 border border-white/15 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Work() {
  return (
    <section
      id="work"
      data-testid="work-section"
      className="relative py-24 md:py-36 px-6 md:px-12 lg:px-16 border-t border-white/10"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 md:mb-20">
          <div className="max-w-2xl">
            <span className="text-xs tracking-[0.25em] uppercase text-neutral-500 font-semibold">
              Selected work · 2 case studies
            </span>
            <h2
              data-testid="work-headline"
              className="font-display mt-6 text-4xl md:text-5xl lg:text-6xl tracking-tight font-light leading-[1.05]"
            >
              From HR Ops to org-wide
              <br />
              <span className="text-neutral-500">force multiplier.</span>
            </h2>
          </div>
          <p className="text-neutral-400 max-w-md text-base leading-relaxed">
            Two engagements at one organisation — first as the operator who
            automated the HR function, then as the project manager who shipped
            the systems the wider team depended on.
          </p>
        </div>

        <div className="space-y-10 md:space-y-14">
          {CASES.map((c, i) => (
            <CaseCard key={c.id} c={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
