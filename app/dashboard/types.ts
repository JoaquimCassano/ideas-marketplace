export interface Idea {
  id: string;
  titulo: string;
  descricao: string;
  upvotes: number;
  downvotes: number;
  userVote: "upvote" | "downvote" | null;
  autorId: string;
  autorName?: string;
  tags: string[];
  commentCount: number;
  createdAt: string;
}

export interface ApiIdea {
  id: string;
  titulo: string;
  descricao: string;
  tags: string[];
  autorId: string;
  autorName?: string;
  upvotes: number;
  downvotes: number;
  didUpvote: boolean;
  didDownvote: boolean;
  comentarios: unknown[];
  createdAt: string;
  updatedAt: string;
}
