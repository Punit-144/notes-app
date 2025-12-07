"use client";


import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import NoSSR from "@/components/NoSSR";

export default function CreateNotePage() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"bullet" | "checklist">("bullet");
  const [items, setItems] = useState([{ text: "", completed: false }]);
  const [error, setError] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new item
  useEffect(() => {
    containerRef.current?.scrollTo({ top: 9999, behavior: "smooth" });
  }, [items.length]);

  // Add -item
  const addItem = () => {
    setItems([...items, { text: "", completed: false }]);
    setError("");
  };

  // Delete -item
  const deleteItem = (index: number) => {
    if (items.length === 1) {
      setError("At least one item is required.");
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  // Move item -up
  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...items];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setItems(updated);
  };

  // Move item -down
  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const updated = [...items];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setItems(updated);
  };

  // Update item text
  const updateItem = (index: number, value: string) => {
    const updated = [...items];
    updated[index].text = value;
    setItems(updated);
  };

  // Update checklist checkbox
  const updateChecked = (index: number, value: boolean) => {
    const updated = [...items];
    updated[index].completed = value;
    setItems(updated);
  };

  // Submit form
  async function handleSubmit() {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    const filtered = items.filter((i) => i.text.trim() !== "");
    if (filtered.length === 0) {
      setError("At least one non-empty item is required.");
      return;
    }

    const res = await fetch("http://localhost:5000/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        type,
        items: filtered,
      }),
    });

    if (res.ok) window.location.href = "/";
    else alert("Failed to create note");
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <h1 className="text-2xl font-semibold mb-6">Create Note</h1>

      {/* Title */}
      <Input
        placeholder="Note title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4"
      />

      {/* Note Type */}
      <div className="flex gap-4 mb-6">
        <Button
          variant={type === "bullet" ? "default" : "outline"}
          onClick={() => setType("bullet")}
        >
          Bullet Note
        </Button>

        <Button
          variant={type === "checklist" ? "default" : "outline"}
          onClick={() => setType("checklist")}
        >
          Checklist Note
        </Button>
      </div>

      {/* items selection */}
      <NoSSR>
        <div ref={containerRef} className="mb-6 max-h-[400px] overflow-y-auto pr-2">
          <h2 className="font-medium mb-3">Items</h2>

          {/* {items.map((item, index) => ( */}
          {items.map((item: { text: string; completed: boolean }, index: number) => (

            <div
              key={index}
              className="flex items-center gap-3 mb-2 p-2 border rounded-md transition-all hover:bg-gray-50"
            >
              {/* Checklist Checkbox */}
              {type === "checklist" && (
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={(checked: boolean | "indeterminate") =>
                    updateChecked(index, checked === true)
                  }
                />
              )}

              {/* Input */}
              <Input
                value={item.text}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  updateItem(index, e.target.value)}

                placeholder={`Item ${index + 1}`}
                className="transition-all"
              />

              {/* mpve-up */}
              <Button
                size="icon-sm"
                variant="outline"
                onClick={() => moveUp(index)}
                className="rounded-full"
              >
                ↑
              </Button>

              {/* move-down */}
              <Button
                size="icon-sm"
                variant="outline"
                onClick={() => moveDown(index)}
                className="rounded-full"
              >
                ↓
              </Button>

              {/* delete */}
              <Button
                size="icon-sm"
                variant="destructive"
                onClick={() => deleteItem(index)}
                className="rounded-full px-3"
              >
                ✕
              </Button>
            </div>
          ))}

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          {/* add item*/}
          <Button variant="outline" onClick={addItem} className="mt-2">
            + Add Item
          </Button>
        </div>
      </NoSSR>

      {/* button - save */}
      <Button onClick={handleSubmit} className="w-32">
        Save Note
      </Button>
    </div>
  );
}
