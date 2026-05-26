import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp, Users, Workflow, Zap } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: Workflow,
    metric: "90%",
    label: "of HR KRAs automated",
  },
  {
    icon: Zap,
    metric: "2 months",
    label: "to ship a full CRM",
  },
  {
    icon: Users,
    metric: "1",
    label: "operator, end-to-end",
  },
  {
    icon: TrendingUp,
    metric: "ATS",
    label: "back on track",
  },
];

const SCOPE = [
  "Payroll automation — cycle time cut from days to hours",
  "Onboarding flows — paperwork, access, comms triggered from a single form",
  "Offboarding — exit checklist, asset recovery and revocations on rails",
  "CRM launch — vendor selection, data model, migration & go-live in 8 weeks",
  "Recruiter job-posting program — multi-channel pipeline with templated briefs",
  "ATS rehabilitation — pipeline hygiene, stage definitions, reporting restored",
  "Consultative direction — quarterly OKRs and operating cadence for the team",
];

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
              Selected work · Case study 01
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
            A single operator stepping into HR Operations & Engagement —
            quietly rebuilding the org's automation, CRM and ATS foundations in
            under a quarter.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          data-testid="case-study-card"
          className="border border-white/10 bg-[#0a0a0a]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-white/10">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-neutral-500">
                <span className="block w-6 h-px bg-neutral-500" />
                In-house engagement · HR Ops → Project Mgmt
              </div>
              <h3 className="font-display mt-6 text-3xl md:text-4xl tracking-tight font-medium leading-tight">
                Automated 90% of an HR Senior Executive's KRAs — then took the
                wheel as Project Manager.
              </h3>
              <div className="mt-8 space-y-5 text-neutral-300 leading-relaxed text-[15px]">
                <p>
                  As HR Operations & Engagement Senior Executive, the brief was
                  simple on paper, sprawling in practice: payroll, onboarding,
                  offboarding, engagement programs, recruiter coordination and
                  reporting. Within the first quarter, ~90% of those KRAs were
                  running on automated workflows — freeing the human time for
                  what actually moved the needle.
                </p>
                <p>
                  The mandate then expanded into Project Management. In the
                  following two months, the CRM was launched end-to-end, an
                  extra program for recruiter job posts went live, the ATS was
                  brought back on track, and the broader team got clear
                  consultative direction on how to operate.
                </p>
              </div>

              <div className="mt-10">
                <div className="text-xs uppercase tracking-[0.25em] text-neutral-500 mb-4">
                  Scope delivered
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {SCOPE.map((s) => (
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
                data-testid="case-study-cta"
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
                {HIGHLIGHTS.map((h, i) => {
                  const Icon = h.icon;
                  return (
                    <motion.div
                      key={h.label}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.07 }}
                      data-testid={`case-highlight-${i}`}
                      className="bg-[#0a0a0a] p-6 md:p-8"
                    >
                      <Icon
                        size={18}
                        className="text-neutral-500 mb-4"
                      />
                      <div className="font-display text-3xl md:text-4xl font-light tracking-tight">
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
                  {[
                    "Zapier",
                    "n8n",
                    "Google Workspace",
                    "Slack",
                    "ATS",
                    "CRM",
                    "Payroll software",
                    "Custom scripts",
                  ].map((t) => (
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
      </div>
    </section>
  );
}
