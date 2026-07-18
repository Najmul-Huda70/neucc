// Shared type definitions. Keep this file in sync with backend/src/types.ts.

export type Role = "user" | "admin";

export type Batch = "1st year" | "2nd year" | "3rd year" | "final year";

export const BATCHES: Batch[] = ["1st year", "2nd year", "3rd year", "final year"];

export type EventCategory =
  | "Contest"
  | "Fest"
  | "Workshop"
  | "Sports"
  | "Seminar"
  | "Social"
  | "Election";

export const EVENT_CATEGORIES: EventCategory[] = [
  "Contest",
  "Fest",
  "Workshop",
  "Sports",
  "Seminar",
  "Social",
  "Election",
];

export type NominationStatus = "pending" | "approved" | "disqualified";

export interface User {
  _id: string;
  name: string;
  studentId: string;
  batch: Batch;
  email: string;
  role: Role;
  createdAt: string;
}

export interface EventDoc {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: EventCategory;
  date: string;
  venue: string;
  fee: number | "Free";
  imageUrl: string;
  images: string[];
  specs: Record<string, string>;
  priority: number;
  createdBy: string;
  createdAt: string;
}

export interface Nomination {
  _id: string;
  candidateId: string;
  eventId: string;
  position: string;
  batchYear: Batch;
  supporterName: string;
  supporterId: string;
  representativeName: string;
  representativeId: string;
  photoUrl: string;
  status: NominationStatus;
  appliedAt: string;
}

export interface Review {
  _id: string;
  eventId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface NewsletterSubscriber {
  _id: string;
  email: string;
  subscribedAt: string;
}

export interface Attendee {
  _id: string;
  eventId: string;
  userId: string;
  registeredAt: string;
}

export interface StatsSummary {
  totalMembers: number;
  totalEvents: number;
  upcomingEvents: number;
  totalNominations: number;
  approvedNominations: number;
  eventsByCategory: { category: EventCategory; count: number }[];
  membersByBatch: { batch: Batch; count: number }[];
}

// Standard API response envelope — every backend route returns this shape.
export interface ApiResponse<T> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
}

export interface EventFilters {
  search?: string;
  category?: EventCategory;
  dateFrom?: string;
  dateTo?: string;
  feeType?: "free" | "paid";
  sort?: "date" | "fee-asc" | "fee-desc";
  page?: number;
  limit?: number;
}
