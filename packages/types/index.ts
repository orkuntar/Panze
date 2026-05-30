export type AuthResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
};
