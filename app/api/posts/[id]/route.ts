import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(post);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.post.delete({
    where: {
      id: Number(id),
    },
  });

  return NextResponse.json({ message: "Deleted" }, { status: 204 });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { title, content, author } = await req.json();

  const post = await prisma.post.update({
    where: {
      id: Number(id),
    },
    data: {
      title,
      content,
      author,
    },
  });

  return NextResponse.json(post);
}
