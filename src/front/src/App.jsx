import { useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000"
});

const createJob = (fileName, contentType) =>
  api.post("/jobs", { fileName, contentType });

const uploadFile = (url, file) =>
  axios.put(url, file, {
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      "x-ms-blob-type": "BlockBlob",
    },
  });

const getJob = (jobId) => api.get(`/jobs/${jobId}`);

export default function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f) => { if (f) setFile(f); };

  const handleUpload = async () => {
    if (!file) return;
    setStatus("creating");
    setError(null);
    setJob(null);

    try {
      const res = await createJob(file.name, file.type || "application/octet-stream");
      const { jobId, uploadUrl } = res.data;

      setStatus("uploading");
      await uploadFile(uploadUrl, file);
      setStatus("processing");

      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        try {
          const jobRes = await getJob(jobId);
          const j = jobRes.data;
          setJob(j);
          if (j.status === "DONE" || j.status === "ERROR" || attempts > 20) {
            clearInterval(poll);
            setStatus(j.status === "DONE" ? "done" : "error");
          }
        } catch {
          if (attempts > 20) { clearInterval(poll); setStatus("error"); }
        }
      }, 1500);
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const reset = () => { setFile(null); setStatus("idle"); setJob(null); setError(null); };

  return (
    <div style={s.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={s.card}>
        <div style={s.header}>
          <div style={s.logo}>📤</div>
          <div>
            <h1 style={s.title}>DocUpload</h1>
            <p style={s.sub}>Dépose ton fichier, on s'occupe du reste</p>
          </div>
        </div>

        {status === "idle" && (
          <>
            <div
              style={{ ...s.drop, ...(dragOver ? s.dropActive : {}) }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => document.getElementById("fi").click()}
            >
              <input id="fi" type="file" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
              {file ? (
                <div style={s.fileRow}>
                  <span style={s.fileEmoji}>📄</span>
                  <div>
                    <p style={s.fileName}>{file.name}</p>
                    <p style={s.fileSize}>{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button style={s.removeBtn} onClick={(e) => { e.stopPropagation(); setFile(null); }}>✕</button>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: "36px", marginBottom: "10px" }}>☁️</div>
                  <p style={s.dropText}>Glisse un fichier ici</p>
                  <p style={s.dropSub}>ou clique pour parcourir</p>
                </div>
              )}
            </div>
            {file && <button style={s.btn} onClick={handleUpload}>Envoyer →</button>}
          </>
        )}

        {["creating", "uploading", "processing"].includes(status) && (
          <div style={s.center}>
            <div style={{ ...s.spinner, animation: "spin 1s linear infinite" }} />
            <p style={s.progressText}>{{ creating: "Création du job...", uploading: "Upload...", processing: "Traitement..." }[status]}</p>
          </div>
        )}

        {status === "done" && job && (
          <div style={s.center}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>✅</div>
            <h2 style={s.doneTitle}>Fichier traité !</h2>
            <div style={s.grid}>
              {[["Catégorie", job.category], ["Statut", "DONE"], ["Résumé", job.resultSummary]].map(([l, v]) => (
                <div key={l} style={s.gridItem}>
                  <span style={s.gridLabel}>{l}</span>
                  <span style={s.gridValue}>{v || "—"}</span>
                </div>
              ))}
            </div>
            <button style={s.resetBtn} onClick={reset}>Nouveau fichier</button>
          </div>
        )}

        {status === "error" && (
          <div style={s.center}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>❌</div>
            <p style={{ color: "#f87171", marginBottom: "16px" }}>{error || "Erreur"}</p>
            <button style={s.resetBtn} onClick={reset}>Réessayer</button>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "system-ui, sans-serif" },
  card: { background: "#1e293b", borderRadius: "20px", padding: "36px", width: "100%", maxWidth: "460px", border: "1px solid #334155" },
  header: { display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" },
  logo: { fontSize: "32px" },
  title: { margin: 0, fontSize: "22px", fontWeight: "700", color: "#f1f5f9" },
  sub: { margin: "2px 0 0", fontSize: "13px", color: "#64748b" },
  drop: { border: "2px dashed #334155", borderRadius: "14px", padding: "36px 20px", textAlign: "center", cursor: "pointer", background: "#0f172a", marginBottom: "16px", transition: "border-color 0.2s" },
  dropActive: { borderColor: "#0ea5e9", background: "rgba(14,165,233,0.05)" },
  dropText: { margin: "0 0 4px", fontSize: "15px", fontWeight: "600", color: "#cbd5e1" },
  dropSub: { margin: 0, fontSize: "13px", color: "#475569" },
  fileRow: { display: "flex", alignItems: "center", gap: "12px", textAlign: "left" },
  fileEmoji: { fontSize: "28px" },
  fileName: { margin: "0 0 2px", fontSize: "14px", fontWeight: "600", color: "#f1f5f9" },
  fileSize: { margin: 0, fontSize: "12px", color: "#64748b" },
  removeBtn: { marginLeft: "auto", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "16px" },
  btn: { width: "100%", padding: "14px", background: "#0ea5e9", color: "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer" },
  center: { textAlign: "center", padding: "10px 0" },
  spinner: { width: "40px", height: "40px", border: "3px solid #334155", borderTop: "3px solid #0ea5e9", borderRadius: "50%", margin: "0 auto 16px" },
  progressText: { color: "#94a3b8", fontSize: "15px" },
  doneTitle: { margin: "0 0 20px", fontSize: "20px", fontWeight: "700", color: "#f1f5f9" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" },
  gridItem: { background: "#0f172a", borderRadius: "10px", padding: "12px", textAlign: "left" },
  gridLabel: { display: "block", fontSize: "11px", color: "#475569", marginBottom: "4px", textTransform: "uppercase" },
  gridValue: { display: "block", fontSize: "13px", fontWeight: "600", color: "#cbd5e1" },
  resetBtn: { padding: "12px 28px", background: "#334155", color: "#f1f5f9", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
};