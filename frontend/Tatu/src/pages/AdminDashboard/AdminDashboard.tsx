import { useEffect, useState } from "react";
import { getDashborad } from "../../features/auth/hooks/useGetDashboard";
import "./AdminDashboard.css";
import { Nav } from "@/features/navigation";
import { PeopleExplore } from '@/features/explore'

import { useAuthStore } from "@/stores/authStore";
function AdminDashboard() {
  const { user } = useAuthStore();
  console.log(user)
  return (
    <>
     <div className="container_explore_page">
      <div className="sidebar">
        <Nav optionsAdmin={user?.rol == 3}/>
      </div>
      <div className="main-content">
        <PeopleExplore options={user?.rol == 3}/>
      </div>
    </div>
    </>
  );
}

export default AdminDashboard;
