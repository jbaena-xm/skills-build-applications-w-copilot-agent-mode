import { useEffect, useState } from "react";
import ResourceTable from "./ResourceTable";

const endpoint = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`
  : "http://localhost:8000/api/users/";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const columns = [
    {
      key: "username",
      label: "Username",
      render: (user) => user.username ?? "-",
    },
    {
      key: "email",
      label: "Email",
      render: (user) => user.email ?? "-",
    },
    {
      key: "full_name",
      label: "Full Name",
      render: (user) =>
        `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || "-",
    },
    {
      key: "team",
      label: "Team",
      render: (user) => user.team_name ?? user.team ?? "-",
    },
  ];

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("[Users] REST API endpoint:", endpoint);
      const response = await fetch(endpoint);
      const payload = await response.json();
      const normalized = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.results)
          ? payload.results
          : [];

      console.log("[Users] fetched data:", payload);
      setUsers(normalized);
    } catch (fetchError) {
      console.error("[Users] fetch error:", fetchError);
      setError("Unable to load users from the API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <section>
      <ResourceTable
        title="Users"
        endpoint={endpoint}
        data={users}
        columns={columns}
        onRefresh={loadUsers}
        loading={loading}
        error={error}
      />
    </section>
  );
}

export default Users;
