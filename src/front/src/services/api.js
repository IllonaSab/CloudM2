import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // backend local
});

export const createJob = () => {
  return api.post("/jobs", {
    fileName: "test.pdf",
    contentType: "application/pdf",
  });
};

export const uploadFile = (url, file) => {
  if (!url) throw new Error("uploadUrl is undefined ❌");

  return axios.put(url, file, {
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      "x-ms-blob-type": "BlockBlob",
    },
  });
};