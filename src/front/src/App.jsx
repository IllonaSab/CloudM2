import { useState } from "react";

const API_URL = "https://api-doc-is-hgg7g4d9e2fagpgt.francecentral-01.azurewebsites.net";

function App() {
  const [jobId, setJobId] = useState(null);
  const [file, setFile] = useState(null);

  const createJob = async () => {
    const response = await fetch(`${API_URL}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "New Job" })
    });

    const data = await response.json();
    setJobId(data.id);
  };

  const uploadFile = async () => {
    if (!file || !jobId) return;

    const response = await fetch(`${API_URL}/jobs/${jobId}/upload-url`);
    const { uploadUrl } = await response.json();

    await fetch(uploadUrl, {
      method: "PUT",
      headers: { "x-ms-blob-type": "BlockBlob" },
      body: file
    });

    alert("Upload terminé !");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>CloudM2 Front</h1>

      <button onClick={createJob}>Créer un Job</button>

      {jobId && (
        <>
          <p>Job ID: {jobId}</p>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button onClick={uploadFile}>Uploader</button>
        </>
      )}
    </div>
  );
}

export default App;