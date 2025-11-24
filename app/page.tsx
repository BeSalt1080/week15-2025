"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Post = {
  id: string;
  title: string;
  createdAt: string;
  author: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [toastMessage, setToastMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setToastMessage(message);
      router.replace("/", { scroll: false });
      const timer = setTimeout(() => {
        setToastMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  useEffect(() => {
    const getPosts = async () => {
      const res = await fetch(`/api/posts`, {
        cache: "no-store",
      });
      const data = await res.json();
      setPosts(data);
    };
    getPosts();
  }, []);

  const sortedPosts = [...posts].sort((a, b) => {
    const aValue = a[sortBy as keyof Post];
    const bValue = b[sortBy as keyof Post];

    if (aValue < bValue) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });

  return (
    <main className="container mt-4">
      <h1>Blog Posts</h1>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link href="/create" className="btn btn-primary">
          Create Post
        </Link>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt">Date</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
          </select>
          <select
            className="form-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </div>
      {sortedPosts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul className="list-group">
          {sortedPosts.map((post) => (
            <li key={post.id} className="list-group-item">
              <Link href={`/post/${post.id}`}>{post.title}</Link>
              <span className="text-muted float-end">
                {post.author} -{" "}
                {new Date(post.createdAt).toLocaleDateString("id-ID")}
              </span>
            </li>
          ))}
        </ul>
      )}

      {toastMessage && (
        <div
          className="toast show align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-3"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">{toastMessage}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
              onClick={() => setToastMessage("")}
            ></button>
          </div>
        </div>
      )}
    </main>
  );
}
