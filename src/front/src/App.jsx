import { useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000"
});

export default function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [job, setJob] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");
    const res = await api.post("/jobs", { fileName: file.name, contentType: file.type });
    const { jobId, uploadUrl } = res.data;
    await axios.put(uploadUrl, file, { headers: { "Content-Type": file.type, "x-ms-blob-type": "BlockBlob" } });
    setStatus("processing");
    const poll = setInterval(async () => {
      const r = await api.get(`/jobs/${jobId}`);
      if (r.data.status === "DONE") { setJob(r.data); setStatus("done"); clearInterval(poll); }
    }, 1500);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", gap: "16px" }}>
      <h1>Upload un fichier</h1>
      {status === "idle" && <>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        {file && <button onClick={handleUpload}>Envoyer</button>}
      </>}
      {status === "uploading" && <p>Upload en cours...</p>}
      {status === "processing" && <p>Traitement...</p>}
      {status === "done" && <>
        <p>✅ Terminé !</p>
        <p>Catégorie : {job?.category}</p>
        <p>Résumé : {job?.resultSummary}</p>
        <button onClick={() => { setStatus("idle"); setFile(null); setJob(null); }}>Recommencer</button>
      </>}
    </div>
  );
}