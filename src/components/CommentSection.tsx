import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type Comment = {
  id: number;
  parent_id?: number | null;
  name: string;
  message: string;
  likes: number;
  created_at: string;
};

type Props = {
  articleId: number;
};

const CommentSection = ({ articleId }: Props) => {

  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [replyId, setReplyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD COMMENTS ================= */

  const loadComments = async () => {

    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("article_id", articleId)
      .order("created_at", { ascending: true });
    setComments(data || []);

  };

  useEffect(() => {
    loadComments();
    const channel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        () => loadComments()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /* ================= SUBMIT COMMENT ================= */

  const submit = async () => {
    if (!name || !message) {
      toast.error("Name and comment required");
      return;
    }
    const lastComment = localStorage.getItem("last_comment");
    if (lastComment && Date.now() - Number(lastComment) < 15000) {
      toast.error("Please wait before commenting again");
      return;
    }
    setLoading(true);
    await supabase
      .from("comments")
      .insert({
        article_id: articleId,
        parent_id: replyId,
        name,
        message
      });

    localStorage.setItem("last_comment", Date.now().toString());

    setMessage("");
    setReplyId(null);
    setLoading(false);
    loadComments();
  };

  /* ================= DELETE COMMENT ================= */

  const removeComment = async (id: number) => {

    const confirmDelete = confirm("Yakin mau hapus komentar ini?");
    if (!confirmDelete) return;

    await supabase
      .from("comments")
      .delete()
      .eq("id", id);

    loadComments();

  };

  /* ================= LIKE ================= */

  const like = async (id: number, current: number) => {

    const key = `liked_${id}`;
    if (localStorage.getItem(key)) {
      toast.error("You already liked this comment");
      return;
    }

    await supabase
      .from("comments")
      .update({ likes: current + 1 })
      .eq("id", id);

    localStorage.setItem(key, "true");
    loadComments();

  };

  /* ================= AVATAR ================= */

  const avatar = (name: string) =>
    name.charAt(0).toUpperCase();

  /* ================= RENDER COMMENTS ================= */

  const renderComments = (parentId: number | null = null) => {

    return comments
      .filter(c => (c.parent_id || null) === parentId)
      .map(comment => (
        <div key={comment.id} className="mt-6">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">
              {avatar(comment.name)}
            </div>
            <div className="flex-1">
              <p className="font-semibold">
                {comment.name}
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                {new Date(comment.created_at).toLocaleDateString()}
              </p>
              <p className="mb-2">
                {comment.message}
              </p>
              <div className="flex gap-4 text-sm">
                <button
                  onClick={() => like(comment.id, comment.likes)}
                >
                  👍 {comment.likes}
                </button>
                <button
                  onClick={() => setReplyId(comment.id)}
                >
                  Reply
                </button>
                <button
                  onClick={() => removeComment(comment.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
              {/* replies */}
              <div className="ml-6 border-l pl-4">
                {renderComments(comment.id)}
              </div>
            </div>
          </div>
        </div>
      ));
  };

  return (
    <div className="mt-20 margin-lr-auto max-w-3xl px-10">
      <h2 className="text-2xl font-bold mb-6">
        Comments
      </h2>

      {/* FORM */}
      <div className="mb-10 space-y-3 rounded-3xl border border-border bg-card p-6 shadow-sm">
        <input
          className="w-full p-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full min-h-[140px] p-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Write a comment..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {replyId && (
          <p className="text-sm text-muted-foreground">
            Replying to comment #{replyId}
          </p>
        )}
        <button
          onClick={submit}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </div>

      {/* COMMENTS */}
      {renderComments(null)}
    </div>
  );
};

export default CommentSection;