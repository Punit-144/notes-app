"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Note {
  note_id: number;
  title: string;
  items: { text: string }[];
}

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const res = await fetch("http://localhost:5000/api/notes");
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error("Failed to fetch notes", err);
      }
    }

    fetchNotes();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Notes Dashboard</h1>
        <Button onClick={() => (window.location.href = "/create")}>
          New Note
        </Button>
      </div>

      {notes.length === 0 && (
        <p className="text-gray-500 mt-10 text-center">No notes yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notes.map((note, index) => (
          <Card
            key={`note-${note.note_id}-${index}`}
            className="shadow-sm hover:shadow-md transition"
          >
            <CardHeader>
              <CardTitle>{note.title}</CardTitle>
            </CardHeader>

            <CardContent>
              <ul className="list-disc ml-5 text-gray-600">
                {note.items.slice(0, 3).map((item, i) => (
                  <li key={`item-${note.note_id}-${i}`}>{item.text}</li>
                ))}
              </ul>

              <Button
                variant="outline"
                className="mt-4"
                onClick={() => (window.location.href = `/note/${note.note_id}`)}
              >
                View / Edit
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
