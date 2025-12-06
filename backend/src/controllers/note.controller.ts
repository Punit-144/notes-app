import { Request, Response } from "express";
import { Note } from "../models/note.model";


export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, type, items } = req.body;

    if (!title || !type) {
      return res.status(400).json({ message: "Title and type are required" });
    }

    const note = await Note.create({ title, type, items });
    return res.status(201).json(note);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 });
    return res.json(notes);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};


export const getNoteById = async (req: Request, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    return res.json(note);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};


export const updateNote = async (req: Request, res: Response) => {
  try {
    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Note not found" });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};


export const deleteNote = async (req: Request, res: Response) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Note not found" });

    return res.json({ message: "Note deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
