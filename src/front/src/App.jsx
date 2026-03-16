import { useState } from "react";

const API_URL = "https://api-doc-is-hgg7g4d9e2fagpgt.francecentral-01.azurewebsites.net";

function App() {
  const [jobId, setJobId] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const createJob = async () => {
    try {
      const response = await fetch(`${API_URL}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "New Job" })
      });

      const data = await response.json();
      setJobId(data.id);
      setMessage("Job créé !");
    } catch (error) {
      console.error(error);
      setMessage("Erreur création job");
    }
  };

  const uploadFile = async () => {
    if (!file || !jobId) return;

    try {
      const response = await fetch(`${API_URL}/jobs/${jobId}/upload-url`);
      const { uploadUrl } = await response.json();

      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "x-ms-blob-type": "BlockBlob" },
        body: file
      });

      setMessage("Upload terminé !");
    } catch (error) {
  console.error(error);
  setMessage("Erreur création job");
}
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>CloudM2 Front</h1>

      <button onClick={createJob}>
        Créer un Job
      </button>

      {jobId && (
        <>
          <p>Job ID : {jobId}</p>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button onClick={uploadFile}>
            Uploader
          </button>
        </>
      )}

      <p>{message}</p>
    </div>
  );
}

export default App;