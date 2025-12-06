import express from "express";
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote
} from "../controllers/note.controller";

const router = express.Router();

//create
router.post("/", createNote);

//readll
router.get("/", getNotes);

//read1
router.get("/:id", getNoteById);

//update
router.put("/:id", updateNote);

//delete
router.delete("/:id", deleteNote);

export default router;
