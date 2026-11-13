"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    category: "Appointments",
    question: "How do I book an appointment?",
    answer:
      "Open Consultation, browse or search for a doctor, then choose an available schedule and follow the booking steps.",
  },
  {
    category: "Appointments",
    question: "Where can I see my appointments?",
    answer:
      "Sign in and open My Appointments in your patient dashboard to review appointment status, schedule, and payment details.",
  },
  {
    category: "Appointments",
    question: "Can I choose a doctor by specialty?",
    answer:
      "Yes. Use the specialty filter on the Consultation page to narrow the doctor directory.",
  },
  {
    category: "Payments",
    question: "How can I pay for an appointment?",
    answer:
      "Follow the payment option shown during booking. If pay-later is offered, you can review the payment status from My Appointments.",
  },
  {
    category: "Payments",
    question: "Where can I check my payment status?",
    answer:
      "Your appointment card and its details page show the current payment status.",
  },
  {
    category: "Prescriptions",
    question: "Where can I find a prescription?",
    answer:
      "Prescriptions shared by your doctor appear under My Prescriptions in the patient dashboard. You can review or download them there.",
  },
  {
    category: "Account",
    question: "How do I update my profile?",
    answer:
      "Sign in, open your account menu, and choose My Profile to review or update your profile information.",
  },
  {
    category: "Account",
    question: "I still need help. How can I contact you?",
    answer:
      "Visit Contact Us and send a message using the form. We’ll reply to the email address you provide.",
  },
];

const categories = [
  "All questions",
  ...Array.from(new Set(faqs.map((faq) => faq.category))),
];

const FAQList = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All questions");

  const filteredFaqs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === "All questions" ||
        faq.category === selectedCategory;
      const matchesSearch =
        !normalizedSearch ||
        `${faq.question} ${faq.answer} ${faq.category}`
          .toLowerCase()
          .includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  return (
    <div>
      <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
        <label className="relative block">
          <span className="sr-only">Search frequently asked questions</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search a question..."
            className="h-11 rounded-xl pl-10"
          />
        </label>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                selectedCategory === category
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        {filteredFaqs.length}{" "}
        {filteredFaqs.length === 1 ? "answer" : "answers"}
      </p>

      {filteredFaqs.length ? (
        <Accordion
          key={selectedCategory}
          type="multiple"
          defaultValue={
            filteredFaqs[0] ? [filteredFaqs[0].question] : []
          }
          className="mt-3 space-y-3"
        >
          {filteredFaqs.map((faq) => (
            <AccordionItem
              key={faq.question}
              value={faq.question}
              className="last:border-b rounded-2xl border bg-card px-5 shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-md sm:px-6"
            >
              <AccordionTrigger className="py-5 text-base font-semibold hover:no-underline sm:text-lg">
                <span>{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="border-t border-border pb-5 pt-4 leading-6 text-muted-foreground">
                <p className="max-w-3xl">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="mt-3 rounded-2xl border border-dashed px-6 py-12 text-center">
          <h2 className="font-semibold">No matching questions</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different search or choose another topic.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedCategory("All questions");
            }}
            className="mt-4 text-sm font-semibold text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FAQList;
