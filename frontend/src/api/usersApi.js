import API from "./api"

export const getUsers = async () => {
    const res = await API.get("/admin/users");
    return res.data          
}

export const createUser = async (form) => {
    const res = await API.post("/auth/create-user",form);
    return res.data
}

export const createStudent = async (form) => {
    const res = await API.post("/auth/create-student",form);
    return res.data
}

export const updateUser = async({id, form}) => {
    const res = await API.put(`/admin/users/${id}`,form);
    return res.data
}

export const deleteUser = async (id) => {
    const res = await API.delete(`/admin/users/${id}`);
    return res.data
}