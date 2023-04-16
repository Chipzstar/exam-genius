export interface LoginUser {
  email: string;
  password: string;
}

export type ClerkEvent = {
  data: UserData;
  object: "event";
  type: ClerkEventType;
};

type ClerkEventType = "user.created" | "user.updated" | "email.created" | "user.deleted";

export interface UserData {
  backup_code_enabled: boolean
  banned: boolean
  birthday: string
  created_at: number
  email_addresses: EmailAddress[]
  external_accounts: any[]
  external_id: any
  first_name: string
  gender: string
  id: string
  image_url: string
  last_name: string
  last_sign_in_at: any
  object: string
  password_enabled: boolean
  phone_numbers: any[]
  primary_email_address_id: string
  primary_phone_number_id: any
  primary_web3_wallet_id: any
  private_metadata: PrivateMetadata
  profile_image_url: string
  public_metadata: PublicMetadata
  totp_enabled: boolean
  two_factor_enabled: boolean
  unsafe_metadata: UnsafeMetadata
  updated_at: number
  username: any
  web3_wallets: any[]
}

export interface EmailAddress {
  email_address: string
  id: string
  linked_to: any[]
  object: string
  reserved: boolean
  verification: Verification
}

export interface Verification {
  attempts: number
  expire_at: number
  status: string
  strategy: string
}

export interface PrivateMetadata {}

export interface PublicMetadata {}

export interface UnsafeMetadata {}

export type Subject = "maths" | "biology" | "chemistry" | "physics" | "economics" | "psychology";

export type ExamBoard = "edexcel" | "aqa" | "ocr"

export interface PaperInfo {
	href: string;
	name: string;
	num_questions: number;
	marks: number;
}

export type CourseInfo = {
  label: string;
  icon: string;
  papers: PaperInfo[];
}
