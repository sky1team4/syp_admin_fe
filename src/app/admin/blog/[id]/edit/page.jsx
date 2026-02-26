"use client";

import { useParams } from "next/navigation";
import PostEditor from "../../PostEditor";

export default function EditPostPage() {
  const params = useParams();
  const id = params?.id ?? null;
  return <PostEditor postId={id} />;
}
