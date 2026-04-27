"use client";

import AdminTable from "components/admin/AdminTable";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
//import AdminTable from "./AdminTable";

export default function AdminPage() {
    const route = useRouter();
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAdmins = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/user-branches", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    //const data = await res.json();
    // console.log("19",data);
    // setAdmins(data.data);
    const data = await res.json();

  if (res.ok) {
    setAdmins(data.data)
    //setDialogTitle("Success");
    //setDialogMessage(JSON.stringify(data, null, 2));
  } else {
    alert(data.message);
    route.push("default");
    //setDialogTitle("Error");
    //setDialogMessage(data.message || "Something went wrong");
  }

  //setDialogOpen(true);
  //setLoading(false);
    setLoading(false);
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <AdminTable tableData={admins} reload={loadAdmins} />
    </div>
  );
}
