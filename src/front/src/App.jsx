import { useState } from "react";
import CreateJob from "./components/CreateJob";
import UploadFile from "./components/UploadFile";

function App() {
  const [uploadUrl, setUploadUrl] = useState(null);

  return (
    <div>
      <h1>Upload Test</h1>

      <CreateJob setUploadUrl={setUploadUrl} />

      {uploadUrl && <UploadFile uploadUrl={uploadUrl} />}
    </div>
  );
}

export default App; // 🔥 OBLIGATOIRE