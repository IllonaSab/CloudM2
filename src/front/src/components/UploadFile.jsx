import { useState } from "react";
import { uploadFile } from "../services/api";

export default function UploadFile({ jobId }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Select a file");
      return;
    }

    try {
      await uploadFile(jobId, file);
      alert("Upload success");
    } catch (err) {
      console.error(err);
      alert("Upload error");
    }
  };

  return (
    <div>
      <h2>Upload File</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
}