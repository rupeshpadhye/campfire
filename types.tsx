
export type Invite = { 
    id: string,
    email: string,
    status: string,
}

export type User = {
  id: string,
  name?: string,
  email: string,
  emailVerified? : Date
  image? : string,
  role?: string,
}

export type EventProp = {
    id: number;
    title: string;
    author: {
      name: string;
      email: string;
    } | null;
    content: string;
    published: boolean;
    headerImage?: string;
    backgroundImage?: string;
    uniqueLink?: string;
    expiresAt?: Date;
    invites?: Invite[];
  };
  