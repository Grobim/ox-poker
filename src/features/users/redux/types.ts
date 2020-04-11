import type { UserProfile } from "../../auth";

interface User extends UserProfile {
  id: string;
}

interface UsersState {
  users: User[];
  toto: number;
}

export type { User, UsersState };
