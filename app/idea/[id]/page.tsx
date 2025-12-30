import { notFound, redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import { getDb } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import Link from "next/link";
import { ArrowLeftIcon } from "@/app/components/icons";
import { CommentSection } from "@/app/components";
import { IdeaDetailCard } from "@/app/components/cards";

interface Comment {
  _id: ObjectId;
  userId: string;
  userName: string;
  texto: string;
  parentCommentId?: string;
  depth: number;
  upvotes: string[];
  downvotes: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IdeaDocument {
  _id: ObjectId;
  titulo: string;
  descricao?: string;
  tags: string[];
  autorId: string;
  autorName: string;
  upvotes: string[];
  downvotes: string[];
  comentarios: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export default async function IdeaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    notFound();
  }

  const db = await getDb();
  const ideasCollection = db.collection<IdeaDocument>("ideas");

  const idea = await ideasCollection.findOne({ _id: new ObjectId(id) });

  if (!idea) {
    notFound();
  }

  const formattedIdea = {
    id: idea._id.toString(),
    titulo: idea.titulo,
    descricao: idea.descricao,
    tags: idea.tags,
    autorId: idea.autorId,
    autorName: idea.autorName || "Anonymous",
    upvotes: idea.upvotes?.length || 0,
    downvotes: idea.downvotes?.length || 0,
    didUpvote: idea.upvotes?.includes(session.user.id) || false,
    didDownvote: idea.downvotes?.includes(session.user.id) || false,
    commentCount: idea.comentarios?.length || 0,
    createdAt: idea.createdAt,
  };

  const comments = (idea.comentarios || []).map((comment) => ({
    id: comment._id.toString(),
    userId: comment.userId,
    userName: comment.userName,
    texto: comment.texto,
    parentCommentId: comment.parentCommentId,
    depth: comment.depth,
    upvotes: comment.upvotes?.length || 0,
    downvotes: comment.downvotes?.length || 0,
    didUpvote: session.user?.id
      ? comment.upvotes?.includes(session.user.id) || false
      : false,
    didDownvote: session.user?.id
      ? comment.downvotes?.includes(session.user.id) || false
      : false,
    isDeleted: comment.isDeleted,
    createdAt: comment.createdAt,
  }));

  return (
    <div className="min-h-screen bg-[var(--cream)] py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 mb-6 text-lg font-medium text-[var(--deep-black)] hover:text-[var(--hot-pink)] transition-colors group"
        >
          <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Feed
        </Link>

        <IdeaDetailCard idea={formattedIdea} currentUserId={session.user.id} />

        <CommentSection
          ideaId={id}
          comments={comments}
          currentUserId={session.user.id}
          currentUserName={session.user.name || "Anonymous"}
        />
      </div>
    </div>
  );
}
