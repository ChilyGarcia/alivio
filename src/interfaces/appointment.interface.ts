export interface Appointment {
  current_page: number;
  data: Datum[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: null;
  path: string;
  per_page: number;
  prev_page_url: null;
  to: number;
  total: number;
}

export interface Datum {
  id: number;
  health_professional_id: number;
  patient_id: number;
  accesibility_id: number;
  date: Date;
  start_time: string;
  end_time: string;
  status: string;
  total_cost: string;
  total_cost_cents: number;
  created_at: Date;
  updated_at: Date;
  health_professional: HealthProfessional;
  accesibility: Accesibility;
}

export interface Accesibility {
  id: number;
  type: string;
  created_at: null;
  updated_at: null;
}

export interface HealthProfessional {
  id: number;
  user_id: number;
  specialty_id: number;
  description: string;
  rating: string;
  hourly_rate: string;
  reviews: number;
  created_at: Date;
  updated_at: Date;
  specialty: Specialty;
  user: User;
  locations: any[];
}

export interface Specialty {
  id: number;
  name: string;
  specialty_group_id: number;
  created_at: null;
  updated_at: Date;
}

export interface User {
  id: number;
  name: string;
  email: string;
  gender: string;
  age: null;
  phone_number: string;
  phone_indicator: string;
  email_verified_at: Date;
  created_at: Date;
  updated_at: Date;
  role: string;
  profile_image: null;
  profile_image_url: null;
}

export interface Link {
  url: null | string;
  label: string;
  active: boolean;
}
