import { useState } from "react";
import { createJob } from "../services/api";

export default function CreateJob({ onJobCreated }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // ← ICI

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const job = await createJob({ name });
      onJobCreated(job);
      setName("");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création du job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Créer un job</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom du job"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Création..." : "Créer"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
