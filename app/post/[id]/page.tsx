"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PostDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<unknown>(null);

  useEffect(() => {
    fetch(`/api/posts/${id}`).then(async (res) => {
      if (res.status === 404) router.push("/not-found");
      else setPost(await res.json());
    });
  }, [id, router]);

  const handleDelete = async () => {
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    router.push("/?message=Successfully%20Deleted%20Post");
  };

  if (!post) return <p className="container mt-4">Loading...</p>;

  return (
    <main className="container mt-4">
      <h1>{(post as { title: string }).title}</h1>
      <p className="text-muted">
        {new Date((post as { createdAt: string }).createdAt).toLocaleDateString(
          "id-ID"
        )}{" "}
        by {(post as { author: string }).author}
      </p>
      <div dangerouslySetInnerHTML={{ __html: (post as { content: string }).content }} />
      <div className="d-flex gap-2">
        <button
          onClick={() => router.push(`/post/${id}/edit`)}
          className="btn btn-primary"
        >
          Edit
        </button>
        <button onClick={handleDelete} className="btn btn-danger">
          Delete
        </button>
      </div>
    </main>
  );
}
