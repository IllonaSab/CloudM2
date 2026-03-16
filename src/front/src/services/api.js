// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://api-doc-is-hgg7g4d9e2fagpgt.francecentral-01.azurewebsites.net/", // à extraire en env si tu veux
});

export const createJob = async (payload) => {
  const { data } = await api.post("/jobs", payload);
  return data; // ex: { id: '123', ... }
};

export const uploadFile = async (jobId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post(`/jobs/${jobId}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const healthCheck = async () => {
  const { data } = await api.get("/health");
  return data;
};
