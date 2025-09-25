import { ProfileUserEnum } from "../enums/profile-user.enum";

export interface UserData {
  name: string | null;
  document: string;
  plan: string;
  plan_plus: boolean;
  profile: ProfileUserEnum;
  first_access: boolean;
  viewing_permission: string[];
  company_document: string | null;
  user_activated: boolean;
}
