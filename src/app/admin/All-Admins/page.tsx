"use client";

import AdminTable from "components/admin/AdminTable";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
//import AdminTable from "./AdminTable";

export default function AdminPage() {
    const route = useRouter();
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAdmins = useCallback(async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/user-branches", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (res.ok) {
      setAdmins(data.data);
    } else {
      alert(data.message);
      route.push("default");
    }
    setLoading(false);
  }, [route]);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <AdminTable tableData={admins} reload={loadAdmins} />
    </div>
  );
}
