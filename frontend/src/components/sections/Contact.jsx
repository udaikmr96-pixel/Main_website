import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/lib/api";

const SERVICE_OPTIONS = [
  { value: "design-hosting", label: "Website Design & Hosting" },
  { value: "workflow-automation", label: "Workflow Automation" },
  { value: "linguistic-services", label: "Linguistic Services" },
  { value: "multiple", label: "More than one of the above" },
  { value: "other", label: "Something else" },
];

const initialState = {
  name: "",
  email: "",
  company: "",
  service_interest: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) =>
    setForm((s) => ({ ...s, [key]: e?.target ? e.target.value : e }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.email ||
      !form.service_interest ||
      !form.message
    ) {
      toast.error("Please fill in name, email, service and message.");
      return;
    }
    try {
      setSubmitting(true);
      await api.post("/contact", form);
      toast.success(
        "Message received. We’ll get back to you within one working day.",
      );
      setForm(initialState);
    } catch (err) {
      const detail =
        err?.response?.data?.detail || "Something went wrong. Please retry.";
      toast.error(typeof detail === "string" ? detail : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="relative py-24 md:py-36 px-6 md:px-12 lg:px-16 border-t border-white/10"
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-5"
        >
          <span className="text-xs tracking-[0.25em] uppercase text-neutral-500 font-semibold">
            Contact
          </span>
          <h2 className="font-display mt-6 text-4xl md:text-5xl lg:text-6xl tracking-tighter font-light leading-[1.02]">
            Let’s build
            <br />
            the future
            <span className="text-neutral-500">.</span>
          </h2>
          <p className="mt-8 text-neutral-400 leading-relaxed max-w-md">
            Tell us a bit about your project. We reply to every message
            personally — usually within one working day.
          </p>

          <div className="mt-12 space-y-5 text-sm">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                Email
              </div>
              <a
                href="mailto:uk@individualstake.com"
                data-testid="contact-email-link"
                className="mt-2 inline-block text-white hover:text-neutral-300"
              >
                uk@individualstake.com
              </a>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                Working hours
              </div>
              <div className="mt-2 text-neutral-300">
                Mon — Fri · 09:00 – 18:00 CET
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                Based in
              </div>
              <div className="mt-2 text-neutral-300">
                Remote · serving teams worldwide
              </div>
            </div>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          onSubmit={handleSubmit}
          data-testid="contact-form"
          className="lg:col-span-7 border border-white/10 bg-[#0a0a0a] p-8 md:p-12 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="contact-name"
                className="text-xs uppercase tracking-[0.2em] text-neutral-400"
              >
                Your name
              </Label>
              <Input
                id="contact-name"
                data-testid="contact-input-name"
                value={form.name}
                onChange={update("name")}
                placeholder="Ada Lovelace"
                className="mt-2 bg-transparent border-white/15 focus:border-white text-white placeholder:text-neutral-600 h-12 rounded-none"
              />
            </div>
            <div>
              <Label
                htmlFor="contact-email"
                className="text-xs uppercase tracking-[0.2em] text-neutral-400"
              >
                Email
              </Label>
              <Input
                id="contact-email"
                data-testid="contact-input-email"
                type="email"
                value={form.email}
                onChange={update("email")}
                placeholder="ada@studio.com"
                className="mt-2 bg-transparent border-white/15 focus:border-white text-white placeholder:text-neutral-600 h-12 rounded-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="contact-company"
                className="text-xs uppercase tracking-[0.2em] text-neutral-400"
              >
                Company (optional)
              </Label>
              <Input
                id="contact-company"
                data-testid="contact-input-company"
                value={form.company}
                onChange={update("company")}
                placeholder="Acme Inc."
                className="mt-2 bg-transparent border-white/15 focus:border-white text-white placeholder:text-neutral-600 h-12 rounded-none"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                Service of interest
              </Label>
              <Select
                value={form.service_interest}
                onValueChange={(v) =>
                  setForm((s) => ({ ...s, service_interest: v }))
                }
              >
                <SelectTrigger
                  data-testid="contact-select-service"
                  className="mt-2 bg-transparent border-white/15 focus:border-white text-white h-12 rounded-none"
                >
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/15 text-white">
                  {SERVICE_OPTIONS.map((o) => (
                    <SelectItem
                      key={o.value}
                      value={o.value}
                      data-testid={`contact-service-option-${o.value}`}
                    >
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label
              htmlFor="contact-message"
              className="text-xs uppercase tracking-[0.2em] text-neutral-400"
            >
              Tell us about your project
            </Label>
            <Textarea
              id="contact-message"
              data-testid="contact-input-message"
              value={form.message}
              onChange={update("message")}
              rows={6}
              placeholder="Goals, timeline, languages needed, anything we should know…"
              className="mt-2 bg-transparent border-white/15 focus:border-white text-white placeholder:text-neutral-600 rounded-none resize-none"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
            <p className="text-xs text-neutral-500">
              By submitting you agree to be contacted about your enquiry.
            </p>
            <Button
              type="submit"
              data-testid="contact-submit-button"
              disabled={submitting}
              className="bg-white text-black hover:bg-neutral-200 px-7 h-12 rounded-full text-sm font-medium group disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  Send message
                  <ArrowRight
                    size={16}
                    className="ml-2 transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </Button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
