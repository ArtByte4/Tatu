import { useEffect, useState } from "react";
import { getDashborad } from "../../features/auth/hooks/useGetDashboard";
import "./AdminDashboard.css";
import { useAuthStore } from "@/stores/authStore";
function AdminDashboard()  {

  const { user } = useAuthStore();
  return (
    <>
         <h1 className="text-panel">Yeahhh Admin</h1>
        <h1 className="text-panel">Hola {user?.username}</h1>
    </>
  );
}


export default AdminDashboard;
