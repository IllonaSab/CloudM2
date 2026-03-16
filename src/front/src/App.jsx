import { useMemo, useState } from "react";
import "./App.css";

const rawApiUrl =
  import.meta.env.VITE_API_URL ??
  "https://api-doc-is-hgg7g4d9e2fagpgt.francecentral-01.azurewebsites.net";

const API_URL = rawApiUrl.replace(/\/+$/, "");

const initialJob = {
  jobId: "",
  status: "",
  createdAt: "",
};

function App() {
  const [file, setFile] = useState(null);
  const [job, setJob] = useState(initialJob);
  const [message, setMessage] = useState("Choisis un document pour lancer un job.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fileDetails = useMemo(() => {
    if (!file) {
      return null;
    }

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);

    return {
      name: file.name,
      type: file.type || "application/octet-stream",
      sizeLabel: `${sizeInMb} MB`,
    };
  }, [file]);

  const refreshJob = async (jobId) => {
    if (!jobId) {
      return;
    }

    setIsRefreshing(true);

    try {
      const response = await fetch(`${API_URL}/jobs/${jobId}`);

      if (!response.ok) {
        throw new Error(`Unable to refresh job: ${response.status}`);
      }

      const data = await response.json();
      setJob({
        jobId: data.id ?? jobId,
        status: data.status ?? "UNKNOWN",
        createdAt: data.createdAt ?? "",
      });
      setMessage("Statut du job mis a jour depuis Azure.");
    } catch (error) {
      console.error(error);
      setMessage("Impossible de rafraichir le job pour le moment.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateAndUpload = async () => {
    if (!fileDetails) {
      setMessage("Ajoute un fichier avant de continuer.");
      return;
    }

    setIsSubmitting(true);
    setMessage("Creation du job et preparation de l'upload...");

    try {
      const createResponse = await fetch(`${API_URL}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: fileDetails.name,
          contentType: fileDetails.type,
        }),
      });

      if (!createResponse.ok) {
        throw new Error(`Unable to create job: ${createResponse.status}`);
      }

      const createData = await createResponse.json();

      await fetch(createData.uploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": fileDetails.type,
        },
        body: file,
      });

      setJob({
        jobId: createData.jobId,
        status: createData.status,
        createdAt: createData.createdAt,
      });
      setMessage("Document envoye vers Azure Blob Storage.");

      await refreshJob(createData.jobId);
    } catch (error) {
      console.error(error);
      setMessage("Le job n'a pas pu etre cree ou upload.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">CloudM2 x Azure</p>
          <h1>Console d&apos;ingestion des documents</h1>
          <p className="hero-text">
            Cree un job, charge ton document dans Blob Storage, puis suis son
            statut depuis l&apos;API Azure.
          </p>

          <div className="hero-actions">
            <label className="file-picker" htmlFor="file-upload">
              <span>{fileDetails ? "Changer de fichier" : "Choisir un fichier"}</span>
              <input
                id="file-upload"
                type="file"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
            </label>

            <button
              className="primary-button"
              type="button"
              onClick={handleCreateAndUpload}
              disabled={isSubmitting || !fileDetails}
            >
              {isSubmitting ? "Envoi en cours..." : "Creer et uploader"}
            </button>
          </div>

          <p className="status-banner">{message}</p>
        </div>

        <aside className="info-panel">
          <div className="stat-card">
            <span className="stat-label">API cible</span>
            <strong>{API_URL}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Fichier</span>
            <strong>{fileDetails?.name ?? "Aucun fichier selectionne"}</strong>
            <span>{fileDetails?.sizeLabel ?? "Pret pour un nouveau job"}</span>
          </div>
        </aside>
      </section>

      <section className="job-card">
        <div className="job-card-header">
          <div>
            <p className="section-label">Suivi du job</p>
            <h2>Derniere execution</h2>
          </div>

          <button
            className="secondary-button"
            type="button"
            onClick={() => refreshJob(job.jobId)}
            disabled={!job.jobId || isRefreshing}
          >
            {isRefreshing ? "Actualisation..." : "Rafraichir"}
          </button>
        </div>

        <div className="job-grid">
          <article className="job-metric">
            <span>Job ID</span>
            <strong>{job.jobId || "Pas encore cree"}</strong>
          </article>
          <article className="job-metric">
            <span>Statut</span>
            <strong>{job.status || "En attente"}</strong>
          </article>
          <article className="job-metric">
            <span>Cree le</span>
            <strong>{job.createdAt || "Aucune date disponible"}</strong>
          </article>
        </div>
      </section>
    </main>
  );
}

export default App;
