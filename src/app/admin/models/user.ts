
export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    isBanned: boolean;
    createdAt: Date;
    lastLogin: Date;
    role: string;
    age?: number;
  }