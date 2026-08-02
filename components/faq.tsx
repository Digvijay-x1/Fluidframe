"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { QuestionIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";

const FAQS = [
  {
    question: "What is Fluidframe and who is it built for?",
    answer:
      "Fluidframe is a browser-native visual studio built for creators, indie makers, designers, and marketers. It lets you create device mockups, fluid animated mesh gradients, retro dither shaders, and export studio-quality 4K images and 60 FPS MP4 video loops with zero complexity.",
  },
  {
    question: "What are dither shaders and how do they work?",
    answer:
      "Dithering is a timeless visual aesthetic that renders color gradients and shadows using stylized pixel and dot-matrix patterns (like 90s cyber aesthetics and vintage displays). Fluidframe processes these shaders live on your GPU at 60 FPS, giving your artwork an authentic retro-modern feel with instant controls.",
  },
  {
    question: "Is Fluidframe really 100% free and private?",
    answer:
      "Yes, completely. Fluidframe runs 100% client-side directly in your browser. None of your uploaded images, compositions, or exported files are ever sent to a remote server or stored in a database. Your data never leaves your device.",
  },
  {
    question: "What export formats and resolutions are supported?",
    answer:
      "Fluidframe supports lossless 1x, 2x Retina, and 4K UHD resolution exports in PNG and JPEG formats, alongside broadcast-ready 60 FPS MP4 video animations, WebM, and animated GIFs optimized for all social platforms.",
  },
  {
    question: "Can I use Fluidframe exports for commercial work?",
    answer:
      "Absolutely. Everything you design and export inside Fluidframe is 100% owned by you. You have full commercial rights for client projects, social media channels, product marketing, SaaS landing pages, and portfolio showcases.",
  },
  {
    question: "Which browsers and devices are supported?",
    answer:
      "Fluidframe supports any modern browser with WebGL hardware acceleration enabled, including Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge, and Arc across desktop, laptop, and tablet devices.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="w-full py-24 relative">
      <div className="w-[92%] max-w-3xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-xl mx-auto mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-border/80 dark:border-neutral-800 bg-muted/40 text-xs font-semibold font-manrope text-muted-foreground mb-4">
            <span>Got Questions ?</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-foreground">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground font-manrope ">
            Everything you need to know about Fluidframe, shader workflows, privacy.
          </p>
        </motion.div>

        {/* Accordion List with Rounded Styling and Generous Padding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-3.5">
            {FAQS.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border border-border/70 dark:border-neutral-800 rounded-2xl px-5 sm:px-6 bg-card/60 backdrop-blur-xl shadow-xs hover:border-primary/40 transition-colors duration-200 last:border-b"
              >
                <AccordionTrigger className="text-sm sm:text-base font-semibold font-manrope text-foreground py-4 sm:py-5 hover:no-underline text-left cursor-pointer">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-muted-foreground font-manrope leading-relaxed pb-5 pt-1">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
