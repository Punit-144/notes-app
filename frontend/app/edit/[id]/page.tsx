"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface NoteItem {
  text: string;
  completed: boolean;
}

interface Note {
  _id: string;
  title: string;
  type: "bullet" | "checklist";
  items: NoteItem[];
}

export default function EditNotePage() {
  const params = useParams();
  const noteId = params.id as string;

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNote() {
      try {
        const res = await fetch(`http://localhost:5000/api/notes/${noteId}`);
        const data = await res.json();
        setNote(data);
      } catch (err) {
        toast.error("Failed to load note");
      } finally {
        setLoading(false);
      }
    }

    fetchNote();
  }, [noteId]);

  if (loading) return <p className="p-5">Loading...</p>;
  if (!note) return <p className="p-5">Note not found</p>;

  return (
    <div className="max-w-2xl mx-auto">

      <h1 className="text-2xl font-semibold mb-4">Edit Note</h1>

      <Input
        value={note.title}
        onChange={(e) =>
          setNote({ ...note, title: e.target.value })
        }
        className="mb-4"
      />

      <div className="flex gap-4 mb-4">
        <Button
          variant={note.type === "bullet" ? "default" : "outline"}
          onClick={() => setNote({ ...note, type: "bullet" })}
        >
          Bullet
        </Button>
        <Button
          variant={note.type === "checklist" ? "default" : "outline"}
          onClick={() => setNote({ ...note, type: "checklist" })}
        >
          Checklist
        </Button>
      </div>

      {/* Items UI will be added in next step */}
      <p className="text-sm text-gray-500">Items editor coming next...</p>
    </div>
  );
}
