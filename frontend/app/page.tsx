"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch notes
  useEffect(() => {
    async function fetchNotes() {
      try {
        const res = await fetch("http://localhost:5000/api/notes");
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, []);

  // Delete handler
  async function handleDelete(id: string) {
    const confirmed = confirm("Are you sure you want to delete this note?");
    if (!confirmed) return;

    try {
      await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "DELETE",
      });

      // Remove from UI
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }

  // Edit handler (actual edit page coming later)
  function handleEdit(id: string) {
    window.location.href = `/edit/${id}`;
  }

  if (loading) {
    return <p className="text-center py-10">Loading notes...</p>;
  }

  if (notes.length === 0) {
    return <p className="text-center py-10">No notes found. Create a new one!</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {notes.map((note) => (
        <Card key={note._id} className="relative">
          
          {/* Edit & Delete Buttons */}
          <div className="absolute top-3 right-3 flex gap-3 text-sm">
            <button
              onClick={() => handleEdit(note._id)}
              className="text-blue-600 hover:underline"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(note._id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>

          <CardHeader>
            <CardTitle>{note.title}</CardTitle>
          </CardHeader>

          <CardContent>
            {note.type === "bullet" ? (
              <ul className="list-disc ml-5">
                {note.items.map((item, index) => (
                  <li key={index}>{item.text}</li>
                ))}
              </ul>
            ) : (
              <ul>
                {note.items.map((item, index) => (
                  <li key={index} className="flex gap-2 items-center">
                    <input type="checkbox" checked={item.completed} readOnly />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
