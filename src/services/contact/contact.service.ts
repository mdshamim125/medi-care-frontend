"use server";

import { serverFetch } from "@/lib/server-fetch";
import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email address."),
  subject: z.string().trim().min(3, "Please enter a subject.").max(120),
  message: z.string().trim().min(10, "Please enter at least 10 characters.").max(5000),
});

export interface ContactFormState {
  success: boolean;
  message: string;
  errors?: Partial<Record<keyof z.infer<typeof contactFormSchema>, string>>;
}

export async function submitContactInquiry(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const validation = contactFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    return {
      success: false,
      message: "Please review the highlighted fields.",
      errors: {
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        subject: fieldErrors.subject?.[0],
        message: fieldErrors.message?.[0],
      },
    };
  }

  try {
    const response = await serverFetch.post("/contact", {
      body: JSON.stringify(validation.data),
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const contentType = response.headers.get("content-type");
    const result: { success?: boolean; message?: string } =
      contentType?.includes("application/json")
        ? await response.json()
        : { message: await response.text() };

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "We could not send your message.",
      };
    }

    return {
      success: true,
      message: "Thanks for reaching out. Your message has been sent.",
    };
  } catch (error) {
    console.error("Failed to submit contact inquiry:", error);
    return {
      success: false,
      message: "We could not send your message. Please try again later.",
    };
  }
}
