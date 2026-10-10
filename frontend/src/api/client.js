import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// ---------------- Admin ----------------
export const adminLogin = (username, password) =>
  api.post("/admin/login", { username, password }).then((r) => r.data);

export const listAdmins = () => api.get("/admin/admins").then((r) => r.data);

export const createAdmin = (username, password) =>
  api.post("/admin/admins", { username, password }).then((r) => r.data);

export const deleteAdmin = (username) =>
  api.delete(`/admin/admins/${encodeURIComponent(username)}`).then((r) => r.data);

// ---------------- Jobs ----------------
export const listJobs = () => api.get("/jobs").then((r) => r.data);

export const getJob = (jdId) => api.get(`/jobs/${jdId}`).then((r) => r.data);

export const createJob = (title, file) => {
  const form = new FormData();
  form.append("title", title);
  form.append("file", file);
  return api
    .post("/jobs", form, { headers: { "Content-Type": "multipart/form-data" } })
    .then((r) => r.data);
};

export const deleteJob = (jdId) => api.delete(`/jobs/${jdId}`).then((r) => r.data);

export const summarizeJob = (jdId) =>
  api.post(`/jobs/${jdId}/summarize`).then((r) => r.data);

// ---------------- Applications ----------------
export const applyToJob = (jdId, candidateName, resumeFile) => {
  const form = new FormData();
  form.append("candidate_name", candidateName);
  form.append("resume", resumeFile);
  return api
    .post(`/jobs/${jdId}/apply`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};

// ---------------- Review ----------------
export const getReview = (jdId) => api.get(`/jobs/${jdId}/review`).then((r) => r.data);

export const downloadResumeUrl = (resumeId, candidateName, filename) =>
  `/api/resumes/${resumeId}/download?candidate_name=${encodeURIComponent(
    candidateName
  )}&filename=${encodeURIComponent(filename)}`;

export default api;
