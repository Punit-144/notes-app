import mongoose, { Schema, Document } from "mongoose";

export type NoteType = "bullet" | "checklist";

export interface INoteItem {
  text: string;
  completed?: boolean; // relevantfor -checklist notes
}

export interface INote extends Document {
  title: string;
  type: NoteType;
  items: INoteItem[];
  createdAt: Date;
  updatedAt: Date;
}

const NoteItemSchema = new Schema<INoteItem>(
  {
    text: { type: String, required: true },
    completed: { type: Boolean, default: false }
  },
  { _id: false }
);

const NoteSchema = new Schema<INote>(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["bullet", "checklist"], required: true },
    items: { type: [NoteItemSchema], default: [] }
  },
  { timestamps: true }
);

export const Note = mongoose.model<INote>("Note", NoteSchema);
