import { useState } from "react";
import { createJob } from "../services/api";

export default function CreateJob({ setUploadUrl }) {
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);

    try {
      const res = await createJob();

      console.log("FULL RESPONSE:", res);       // 🔥
      console.log("DATA:", res.data);           // 🔥
      console.log("UPLOAD URL:", res.data?.uploadUrl); // 🔥

      const url = res.data?.uploadUrl;

      if (!url) {
        alert("uploadUrl backend manquant ❌");
        return;
      }

      setUploadUrl(url);

    } catch (err) {
      console.error(err);
      alert("Erreur création job");
    }

    setLoading(false);
  };

  return (
    <div>
      <button onClick={handleCreate} disabled={loading}>
        {loading ? "Creating..." : "Create Job"}
      </button>
    </div>
  );
}