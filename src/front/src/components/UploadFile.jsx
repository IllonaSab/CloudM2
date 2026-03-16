import { useState } from "react";
import { uploadFile } from "../services/api";

export default function UploadFile({ job }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); // ← indispensable

  if (!job) {
    return <p>Crée d’abord un job pour pouvoir uploader un fichier.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await uploadFile(job.id, file);
      setMessage("Fichier uploadé avec succès");
      setFile(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l’upload");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Uploader un fichier pour le job : {job.name}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0] || null)}
        />
        <button type="submit" disabled={loading || !file}>
          {loading ? "Upload..." : "Uploader"}
        </button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
