import { useState } from "react";
import { uploadWork } from "../services/api";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file");
      return;
    }

    const metadata = { title, category, description };

    try {
      const res = await uploadWork(file, metadata, setProgress);
      setMessage("Upload successful!");
      console.log("Upload Response:", res);
    } catch (err) {
      setMessage(err?.errors?.[0] || "Upload failed");
      console.error(err);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Work</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
