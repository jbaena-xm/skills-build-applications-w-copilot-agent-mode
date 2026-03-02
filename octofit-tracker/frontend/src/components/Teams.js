import { useEffect, useState } from "react";
import ResourceTable from "./ResourceTable";

const endpoint = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
  : "http://localhost:8000/api/teams/";

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const columns = [
    {
      key: "name",
      label: "Team",
      render: (team) => team.name ?? "-",
    },
    {
      key: "members",
      label: "Members",
      render: (team) => (Array.isArray(team.members) ? team.members.length : 0),
    },
    {
      key: "created_at",
      label: "Created",
      render: (team) => team.created_at ?? "-",
    },
  ];

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("[Teams] REST API endpoint:", endpoint);
      const response = await fetch(endpoint);
      const payload = await response.json();
      const normalized = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.results)
          ? payload.results
          : [];

      console.log("[Teams] fetched data:", payload);
      setTeams(normalized);
    } catch (fetchError) {
      console.error("[Teams] fetch error:", fetchError);
      setError("Unable to load teams from the API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  return (
    <section>
      <ResourceTable
        title="Teams"
        endpoint={endpoint}
        data={teams}
        columns={columns}
        onRefresh={loadTeams}
        loading={loading}
        error={error}
      />
    </section>
  );
}

export default Teams;
