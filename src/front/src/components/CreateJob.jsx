import { useState } from "react";
import { createJob } from "../services/api";

export default function CreateJob({ setJobId, setUploadUrl }) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleCreate = async () => {
    if (!file) {
      alert("Sélectionnez un fichier");
      return;
    }

    try {
      setLoading(true);

      const res = await createJob(file.name);

      setJobId(res.data.jobId);
      setUploadUrl(res.data.uploadUrl);

    } catch (err) {
      console.error(err);
      alert("Erreur création job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Job</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleCreate} disabled={loading}>
        {loading ? "Creating..." : "Create Job"}
      </button>
    </div>
  );
}