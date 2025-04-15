import { instance } from "@/lib/axiosConfig";

export const fetchUsers = async () => {
  try {
    const response = await instance.get("/api/users");
    return response.data;
  } catch (error) {
    console.error("Error al traer los usuarios:", error);
    throw error;
  }
};
