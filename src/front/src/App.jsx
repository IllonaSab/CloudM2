// src/App.jsx
import { useState, useEffect } from "react";
import CreateJob from "./components/CreateJob";
import UploadFile from "./components/UploadFile";
import { healthCheck } from "./services/api";
import "./App.css";

function App() {
  const [job, setJob] = useState(null);
  const [health, setHealth] = useState("Vérification...");

  useEffect(() => {
    healthCheck()
      .then(() => setHealth("API OK"))
      .catch(() => setHealth("API KO"));
  }, []);

  return (
    <div className="app">
      <h1>Job + Upload</h1>
      <p>Statut API : {health}</p>

      <CreateJob onJobCreated={setJob} />
      <hr />
      <UploadFile job={job} />
    </div>
  );
}

export default App;
