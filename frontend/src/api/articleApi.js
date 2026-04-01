import API from "./api";

// GET ALL
export const getArticles = async () => {
  const res = await API.get("/articles");
  return res.data;
};

// GET ONE ✅ FIXED
export const getArticleById = async (id) => {
  const res = await API.get(`/articles/${id}`);
  return res.data;
};

// DELETE
export const deleteArticle = async (id) => {
  await API.delete(`/articles/${id}`);
};

// UPDATE ✅ FIXED
export const updateArticle = async (id, data) => {
  const res = await API.put(`/articles/${id}`, {
    title: data.title,
    category: data.category,
    contentBlocks: data.contentBlocks,
  });

  return res.data;
};

// CREATE
export const createArticle = async (data) => {
  const res = await API.post("/articles", data);
  return res.data;
};

export const uploadArticleFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await API.post("/articles/upload", formData);
  return res.data;
};
