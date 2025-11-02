import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../header/AdminHeader";

export default function AdminLayout() {
  return (
    <>
      <AdminHeader />
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </>
  );
}
