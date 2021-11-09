
export type Invite = { 
    id: string,
    email: string,
    status: string,
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
  