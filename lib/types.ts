export type UserRole = "guest" | "male" | "female" | "admin";

export type ModalType = "login" | "register" | null;

export type FemaleTab = "overview" | "profile" | "requests" | "earnings";

export type MaleTab = "overview" | "profile" | "membership" | "requests";

export interface Profile {
  id: number;
  name: string;
  age: number;
  country: string;
  city: string;
  languages: string[];
  verification: "Verified" | "Premium Verified" | "VIP Verified";
  rate: number;
  bio: string;
  available: boolean;
  featured: boolean;
  photoId: string;
  tags: string[];
  height?: string;
  nationality?: string;
  education?: string;
  travel?: string[];
  photos?: string[];
  suspended?: boolean;
}

export interface Member {
  id: number;
  name: string;
  email: string;
  plan: string;
  joined: string;
  status: "Active" | "Suspended";
  spend: string;
  country: string;
  requests: number;
}

export interface ConnectionRequest {
  id: number;
  from: string;
  memberId: number;
  profileId: number;
  profile: string;
  submitted: string;
  status: string;
  message: string;
}

export interface PendingApproval {
  id: number;
  name: string;
  age: number;
  country: string;
  city: string;
  submitted: string;
  docs: boolean;
  selfie: boolean;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  role: string;
  message: string;
  submitted: string;
  createdAt: string;
}
