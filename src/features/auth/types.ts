enum Role {
  ADMIN = "Admin",
}

interface UserProfile {
  avatarUrl: string;
  displayName: string;
  email: string;
  showAvatar: boolean;
  providerData?: Record<string, any>[];
  role?: string;
  avatarBucketPath?: string;
}

export type { UserProfile };
export { Role };
