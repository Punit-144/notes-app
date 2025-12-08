"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import NoSSR from "@/components/NoSSR";

import { motion, AnimatePresence } from "framer-motion";


import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import type { DragEndEvent } from "@dnd-kit/core";

interface Item {
  id: string;
  text: string;
  completed: boolean;
}

interface SortableItemProps {
  item: Item;
  index: number;
  type: "bullet" | "checklist";
  updateItem: (index: number, value: string) => void;
  updateChecked: (index: number, value: boolean) => void;
  deleteItem: (index: number) => void;
}

function SortableItem({
  item,
  index,
  type,
  updateItem,
  updateChecked,
  deleteItem,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      layout
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 mb-2 p-2 rounded-lg border shadow-sm hover:shadow-md transition"
    >
      <button
        {...listeners}
        {...attributes}
        className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-black"
      >
        ☰
      </button>

      {type === "checklist" && (
        <Checkbox
          checked={item.completed}
          onCheckedChange={(checked: boolean | "indeterminate") =>
            updateChecked(index, checked === true)
          }
        />
      )}

      <Input
        value={item.text}
        onChange={(e) => updateItem(index, e.target.value)}
        placeholder={`Item ${index + 1}`}
        className={item.completed ? "line-through text-gray-400" : ""}
      />

      <Button
        variant="destructive"
        size="sm"
        onClick={() => deleteItem(index)}
        disabled={index === 0}
      >
        -
      </Button>
    </motion.div>
  );
}

export default function EditNotePage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"bullet" | "checklist">("bullet");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(useSensor(PointerSensor));


  useEffect(() => {
    async function loadNote() {
      try {
        const res = await fetch(`http://localhost:5000/api/notes/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();

        setTitle(data.title ?? "");
        setType(data.type ?? "bullet");

        setItems(
          Array.isArray(data.items)
            ? data.items.map((it: any) => ({
                id: crypto.randomUUID(),
                text: it.text ?? "",
                completed: it.completed ?? false,
              }))
            : []
        );
      } catch (err) {
        toast.error("Failed to load note");
      } finally {
        setLoading(false);
      }
    }

    loadNote();
  }, [id]);


  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: "", completed: false },
    ]);
  };

  const deleteItem = (index: number) => {
    if (items.length === 1)
      return toast.error("At least one item is required.");

    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, value: string) => {
    const updated = [...items];
    updated[index].text = value;
    setItems(updated);
  };

  const updateChecked = (index: number, value: boolean) => {
    const updated = [...items];
    updated[index].completed = value;
    setItems(updated);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    const newOrder = [...items];
    const [moved] = newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, moved);

    setItems(newOrder);
  };


  async function handleUpdate() {
    if (!title.trim()) return toast.error("Title is required.");

    const filteredItems = items.filter((i) => i.text.trim() !== "");
    if (filteredItems.length === 0)
      return toast.error("Add at least one valid item.");

    const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        type,
        items: filteredItems,
      }),
    });

    if (res.ok) {
      toast.success("Note updated!");
      window.location.href = "/";
    } else {
      toast.error("Failed to update note.");
    }
  }


  async function handleDelete() {
    const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("Note deleted!");
      window.location.href = "/";
    } else {
      toast.error("Failed to delete note.");
    }
  }


  if (loading)
    return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Edit Note</h1>

      <Input
        placeholder="Note title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4"
      />

      <div className="flex gap-4 mb-4">
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

      <NoSSR>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <AnimatePresence>
              {items.map((item, index) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  index={index}
                  type={type}
                  updateItem={updateItem}
                  updateChecked={updateChecked}
                  deleteItem={deleteItem}
                />
              ))}
            </AnimatePresence>
          </SortableContext>
        </DndContext>
      </NoSSR>

      <div className="flex gap-3 mt-2">
        <Button variant="outline" onClick={addItem}>
          + Add Item
        </Button>
      </div>

      <div className="flex gap-3 mt-5">
        <Button onClick={handleUpdate}>Save Changes</Button>

        <Button variant="destructive" onClick={handleDelete}>
          Delete Note
        </Button>
      </div>
    </div>
  );
}
