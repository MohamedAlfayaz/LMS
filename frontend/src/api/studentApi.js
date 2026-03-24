import API from './api';

export const getArticle = async (id) => {
  const res = await API.get(`/articles/${id}`);
  return res.data;
};

export const getHighlights = async () => {
  const res = await API.get("/student/highlights");
  return res.data;
};

export const createHighlight = async (data) => {
  const res = await API.post("/student/highlights", data);
  return res.data;
};

export const deleteHighlight = async (id) => {
  await API.delete(`/student/highlights/${id}`);
};

export const trackReading = async (data) => {
  await API.post("/tracking", data);
};