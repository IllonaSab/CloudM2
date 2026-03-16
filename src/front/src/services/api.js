import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const createJob = (fileName) => {
  return API.post("/jobs", {
    fileName: fileName
  });
};

export const uploadFile = (uploadUrl, file) => {
  return axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type
    }
  });
};