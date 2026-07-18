"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  message: string;
}

/**
 * Validates the input, then persists it via the backend's
 * `POST /api/contact` route (`contact_messages` collection). Reachable
 * later by admins via `GET /api/contact`.
 */
export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (name.length < 2 || !email.includes("@") || message.length < 10) {
    return {
      status: "error",
      message: "Please fill in a valid name, email, and a message of at least 10 characters.",
    };
  }

  try {
    await apiFetch("/api/contact", { method: "POST", body: { name, email, message } });
  } catch (err) {
    return {
      status: "error",
      message:
        err instanceof ApiError
          ? err.message
          : "Could not send your message right now. Please try again shortly.",
    };
  }

  return {
    status: "success",
    message: "Thanks — your message has been received. The committee will reach out by email.",
  };
}

export interface NewsletterState {
  status: "idle" | "success" | "error";
  message: string;
}

export async function subscribeNewsletter(
  _prevState: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email.includes("@") || email.length < 5) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  try {
    const data = await apiFetch<{ alreadySubscribed?: boolean }>("/api/newsletter", {
      method: "POST",
      body: { email },
    });

    if (data?.alreadySubscribed) {
      return { status: "success", message: "You're already subscribed — thanks for sticking around!" };
    }
  } catch (err) {
    return {
      status: "error",
      message:
        err instanceof ApiError
          ? err.message
          : "Could not subscribe right now. Please try again shortly.",
    };
  }

  return { status: "success", message: "Subscribed! Watch your inbox for club updates." };
}

/** Revalidate the events list + a single event page after an admin write. */
export async function revalidateEvents(eventId?: string) {
  revalidatePath("/events");
  if (eventId) revalidatePath(`/events/${eventId}`);
}
