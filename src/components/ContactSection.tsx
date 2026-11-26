import React from "react";
import { siteContent } from "@/content/content";
import { useSettings } from "@/contexts/settings-hook";
import { Send } from "lucide-react";
import { SiBluesky, SiFreelancermap, SiGithub, SiX, SiXing } from "react-icons/si";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form"; // Import FormProvider
import * as z from "zod";
import {
  // Form, // Removed Form from here
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";

const ContactSection = () => {
  const { t } = useSettings();
  const { contact } = siteContent;
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Schema mit Zod für Validierung
  const formSchema = z.object({
    verify: z.string(),
    name: z.string().min(2, {
      message: t(contact.formStatus.validation.name),
    }).max(100, {
      message: t(contact.formStatus.validation.name),
    }),
    email: z.string().max(254, {
      message: t(contact.formStatus.validation.email),
    }).email({
      message: t(contact.formStatus.validation.email),
    }),
    message: z.string().min(10, {
      message: t(contact.formStatus.validation.message),
    }).max(5000, {
      message: t(contact.formStatus.validation.message),
    }),
  });

  // React Hook Form initialisieren
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      verify: "",
      name: "",
      email: "",
      message: "",
    },
  });

  // Formular absenden
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          verify: values.verify,
          name: values.name,
          email: values.email,
          message: values.message
        }),
      });

      const data = await response.json();

      if (response.ok && data) {
        toast({
          title: t(contact.formStatus.sentTitle),
          description: t(contact.formStatus.sentDescription),
        });
        form.reset();
      } else {
        throw new Error(data?.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: t(contact.formStatus.errorTitle),
        description: t(contact.formStatus.errorDescription),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const { availability } = siteContent.hero;
  const fieldClass =
    "h-12 rounded-[var(--radius)] border-ink/25 bg-white/55 px-4 text-base text-ink placeholder:text-ink/55 focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-0";
  const socialClass =
    "inline-flex size-11 items-center justify-center rounded-full border border-ink/30 text-ink transition-[background-color,color,border-color] duration-200 hover:border-ink hover:bg-ink hover:text-signal";

  const socials = [
    { key: "github", href: contact.socialLinks.github, label: "GitHub", icon: <SiGithub className="size-5" aria-hidden="true" focusable="false" /> },
    {
      key: "linkedin",
      href: contact.socialLinks.linkedin,
      label: "LinkedIn",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="size-5"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect width="4" height="12" x="2" y="9"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      ),
    },
    { key: "xing", href: contact.socialLinks.xing, label: "Xing", icon: <SiXing className="size-5" aria-hidden="true" focusable="false" /> },
    { key: "x", href: contact.socialLinks.x, label: "X", icon: <SiX className="size-5" aria-hidden="true" focusable="false" /> },
    { key: "bluesky", href: contact.socialLinks.bluesky, label: "Bluesky", icon: <SiBluesky className="size-5" aria-hidden="true" focusable="false" /> },
    {
      key: "freelancermap",
      href: contact.socialLinks.freelancermap,
      label: "Freelancermap",
      icon: <SiFreelancermap className="size-5" aria-hidden="true" focusable="false" />,
    },
  ].filter((social) => Boolean(social.href));

  return (
    <section id="contact" className="bg-signal py-24 text-ink sm:py-32 [&_::selection]:bg-ink [&_::selection]:text-signal">
      <div className="shell grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <h2 className="display reveal text-[clamp(3rem,1.4rem+6vw,7rem)] leading-[0.9] tracking-[-0.05em]">
            {t(contact.title)}
          </h2>
          <p className="mt-6 max-w-[42ch] text-body text-ink/80">{t(contact.subtitle)}</p>

          <p className="mt-10 max-w-[42ch] border-l-2 border-ink pl-4 text-body">
            <strong className="font-semibold">{t(availability.status)}</strong>
            <span className="text-ink/75"> · {t(availability.detail)}. {t(availability.availableFrom)}.</span>
          </p>

          <h3 className="sr-only">{t(contact.infoTitle)}</h3>
          <dl className="mt-10 space-y-5">
            <div>
              <dt className="text-small text-ink/70">{t(contact.emailLabel)}</dt>
              <dd>
                <a
                  href={`mailto:${contact.email}`}
                  className="wide break-all text-body font-semibold underline decoration-ink/40 decoration-2 underline-offset-[0.25em] transition-[text-decoration-color] duration-200 hover:decoration-ink"
                >
                  {contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-small text-ink/70">{t(contact.phoneLabel)}</dt>
              <dd>
                <a
                  href={`tel:${contact.phone}`}
                  className="wide text-body font-semibold underline decoration-ink/40 decoration-2 underline-offset-[0.25em] transition-[text-decoration-color] duration-200 hover:decoration-ink"
                >
                  {contact.phone}
                </a>
              </dd>
            </div>
          </dl>

          <div className="mt-10">
            <h4 className="text-small font-semibold">{t(contact.findMeOn)}</h4>
            <div className="mt-3 flex flex-wrap gap-3">
              {socials.map((social) => (
                <a
                  key={social.key}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className={socialClass}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 lg:pt-4">
              <FormField
                control={form.control}
                name="verify"
                render={({ field }) => <Input type="hidden" {...field} />}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-small font-semibold text-ink">{t(contact.formLabels.name)}</FormLabel>
                    <FormControl>
                      <Input
                        maxLength={100}
                        placeholder={t(contact.formPlaceholders.name)}
                        className={fieldClass}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-small text-red-900" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-small font-semibold text-ink">{t(contact.formLabels.email)}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        maxLength={254}
                        placeholder={t(contact.formPlaceholders.email)}
                        className={fieldClass}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-small text-red-900" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-small font-semibold text-ink">{t(contact.formLabels.message)}</FormLabel>
                    <FormControl>
                      <Textarea
                        maxLength={5000}
                        rows={6}
                        placeholder={t(contact.formPlaceholders.message)}
                        className={`${fieldClass} h-auto min-h-40 py-3`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-small text-red-900" />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-ink px-6 py-4 text-body font-semibold text-signal transition-[transform,opacity] duration-200 ease-[var(--ease-out-snap)] hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-70 sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-signal border-t-transparent" />
                    {t(contact.formStatus.sending)}
                  </>
                ) : (
                  <>
                    {t(contact.formLabels.send)}
                    <Send className="size-4 transition-transform duration-200 ease-[var(--ease-out-snap)] group-hover:translate-x-1" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          </FormProvider>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
