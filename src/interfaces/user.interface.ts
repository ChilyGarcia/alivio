export interface User {
  id: number;
  name: string;
  email: string;
  gender?: string;
  age?: string;
  phone_number?: string;
  phone_indicator?: string;
  document_number?: string;
  document_type?: string;
  email_verified_at: Date | null;
  created_at: Date | null;
  updated_at: Date;
  role: string;
  profile_image?: string;
  profile_image_url?: string;
}
