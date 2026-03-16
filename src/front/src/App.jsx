import { useState } from "react";
import CreateJob from "./components/CreateJob";
import UploadFile from "./components/UploadFile";

function App() {
  const [jobId, setJobId] = useState(null);
  const [uploadUrl, setUploadUrl] = useState(null);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Job Upload App</h1>

      {!jobId && (
        <CreateJob setJobId={setJobId} setUploadUrl={setUploadUrl} />
      )}

      {jobId && (
        <UploadFile uploadUrl={uploadUrl} />
      )}
    </div>
  );
}

export default App;