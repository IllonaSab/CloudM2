import { useState } from "react";
import { uploadFile } from "../services/api";

export default function UploadFile({ uploadUrl }) {
  console.log("UPLOAD COMPONENT RECEIVED:", uploadUrl); //
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Choisir un fichier");
      return;
    }

    if (!uploadUrl) {
      alert("uploadUrl manquant ❌");
      return;
    }

    try {
      console.log("UPLOAD URL:", uploadUrl);

      await uploadFile(uploadUrl, file);

      alert("Upload OK ✅");
    } catch (err) {
      console.error(err);
      alert("Erreur upload");
    }
  };

  return (
    <div>
      <h2>Upload File</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}