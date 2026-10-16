import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { savePost, type Post } from "@/lib/api";
import { inputClass } from "@/components/AdminShell";
import { Button } from "@/components/ui/button";

const tools: [string, string, string?][] = [["bold", "B"], ["italic", "I"], ["formatBlock", "H2", "h2"], ["formatBlock", "P", "p"], ["insertUnorderedList", "• List"], ["insertOrderedList", "1. List"], ["createLink", "Link"]];

/** Plain HTML form. Content HTML is mirrored into a hidden <textarea name="content">. */
export function PostEditor({ post }: { post?: Post }) {
  const navigate = useNavigate();
  const editorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(post?.image ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const initial = post?.content ?? (post?.body ?? []).map((p) => `<p>${p}</p>`).join("");

  useEffect(() => { if (editorRef.current) editorRef.current.innerHTML = initial; if (contentRef.current) contentRef.current.value = initial; }, [initial]);
  const sync = () => { if (contentRef.current && editorRef.current) contentRef.current.value = editorRef.current.innerHTML; };
  const run = (cmd: string, val?: string) => {
    if (cmd === "createLink") { val = prompt("Link URL") ?? undefined; if (!val) return; }
    document.execCommand(cmd, false, val); editorRef.current?.focus(); sync();
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); sync();
    setBusy(true); setError("");
    try { await savePost(new FormData(e.currentTarget)); navigate({ to: "/admin/dashboard" }); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }

  return (
    <form onSubmit={onSubmit} encType="multipart/form-data" className="grid gap-6">
      {post?.id && <input type="hidden" name="id" value={post.id} />}
      <label className="block text-sm font-medium">Title<input name="title" required defaultValue={post?.title} className={`${inputClass} mt-1`} /></label>
      <label className="block text-sm font-medium">Excerpt<textarea name="excerpt" rows={3} defaultValue={post?.excerpt} className={`${inputClass} mt-1`} /></label>
      <label className="block text-sm font-medium">Category<input name="category" defaultValue={post?.category ?? "Relationships"} className={`${inputClass} mt-1`} /></label>
      <div className="text-sm font-medium">Content
        <div className="mt-1 border border-input">
          <div className="flex flex-wrap gap-1 border-b border-input bg-secondary p-2">
            {tools.map(([cmd, label, val]) => <button key={label} type="button" onClick={() => run(cmd, val)} className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold">{label}</button>)}
          </div>
          <div ref={editorRef} contentEditable suppressContentEditableWarning onInput={sync} className="prose min-h-64 p-4 text-base font-normal focus:outline-none [&_h2]:font-display [&_h2]:text-2xl [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-6" />
        </div>
        <textarea ref={contentRef} name="content" hidden readOnly />
      </div>
      <label className="block text-sm font-medium">Cover image
        <input type="file" name="cover_image" accept="image/*" className="mt-1 block text-sm" onChange={(e) => { const f = e.target.files?.[0]; if (f) setPreview(URL.createObjectURL(f)); }} />
        {post?.image && <input type="hidden" name="existing_image" value={post.image} />}
      </label>
      {preview && <img src={preview} alt="Cover preview" className="aspect-[16/9] w-full max-w-md rounded-t-[3rem] object-cover" />}
      <fieldset className="text-sm"><legend className="font-medium">Status</legend>
        <div className="mt-2 flex gap-6">
          <label className="flex items-center gap-2"><input type="radio" name="status" value="draft" defaultChecked={post?.status !== "published"} /> Draft</label>
          <label className="flex items-center gap-2"><input type="radio" name="status" value="published" defaultChecked={post?.status === "published"} /> Published</label>
        </div>
      </fieldset>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-3"><Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save post"}</Button><Button type="button" variant="outline" onClick={() => navigate({ to: "/admin/dashboard" })}>Cancel</Button></div>
    </form>
  );
}
