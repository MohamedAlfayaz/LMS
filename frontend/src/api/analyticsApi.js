import API from "./api";

export const getAnalytics = async () => {
    const res = await API.get("/analytics");
    return res.data;
}

export const getStudentAnalytics = async () => {
    const res = await API.get("/analytics/student");
    return res.data;
}