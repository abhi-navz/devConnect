import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import api from "../api/axios";

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [connectionsRes, pendingRes] = await Promise.all([
        api.get("/connections"),
        api.get("/connections/pending"),
      ]);
      setConnections(connectionsRes.data.connections);
      setPending(pendingRes.data.requests);
    } catch (err) {
      setError("Failed to load connections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccept = async (connectionId) => {
    setActionLoadingId(connectionId);
    try {
      await api.put(`/connections/accept/${connectionId}`);
      await fetchData();
    } catch (err) {
      setError("Failed to accept request");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (connectionId) => {
    setActionLoadingId(connectionId);
    try {
      await api.put(`/connections/reject/${connectionId}`);
      await fetchData();
    } catch (err) {
      setError("Failed to reject request");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRemove = async (connectionId) => {
    setActionLoadingId(connectionId);
    try {
      await api.delete(`/connections/${connectionId}`);
      await fetchData();
    } catch (err) {
      setError("Failed to remove connection");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-text-primary mb-6 font-mono">
          Connections
        </h1>

        {loading && <LoadingSpinner label="Loading connections..." />}

        {!loading && error && (
          <div className="bg-danger/10 border border-danger text-danger text-sm rounded-lg px-4 py-2.5 mb-6">
            {error}
          </div>
        )}

        {!loading && pending.length > 0 && (
          <div className="mb-8">
            <h2 className="text-text-secondary text-sm uppercase tracking-wide mb-3">
              Pending Requests ({pending.length})
            </h2>
            <div className="space-y-3">
              {pending.map((req) => (
                <div
                  key={req._id}
                  className="bg-bg-secondary border border-border rounded-xl p-4 flex items-center justify-between"
                >
                  <Link
                    to={`/developers/${req.requester.username}`}
                    className="flex items-center gap-3"
                  >
                    {req.requester.profilePicture ? (
                      <img
                        src={req.requester.profilePicture}
                        alt={req.requester.name}
                        className="w-10 h-10 rounded-full object-cover border border-border"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="w-10 h-10 rounded-full bg-bg-tertiary border border-border items-center justify-center text-accent font-bold"
                      style={{
                        display: req.requester.profilePicture ? "none" : "flex",
                      }}
                    >
                      {req.requester.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-text-primary text-sm font-medium">
                        {req.requester.name}
                      </p>
                      <p className="text-text-secondary text-xs">
                        @{req.requester.username}
                      </p>
                    </div>
                  </Link>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      onClick={() => handleAccept(req._id)}
                      disabled={actionLoadingId === req._id}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleReject(req._id)}
                      disabled={actionLoadingId === req._id}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && (
          <div>
            <h2 className="text-text-secondary text-sm uppercase tracking-wide mb-3">
              Your Connections ({connections.length})
            </h2>
            {connections.length === 0 ? (
              <p className="text-text-secondary text-sm">
                No connections yet. Head to{" "}
                <Link
                  to="/discover"
                  className="text-accent hover:text-accent-hover"
                >
                  Discover
                </Link>{" "}
                to find developers.
              </p>
            ) : (
              <div className="space-y-3">
                {connections.map((conn) => (
                  <div
                    key={conn.connectionId}
                    className="bg-bg-secondary border border-border rounded-xl p-4 flex items-center justify-between"
                  >
                    <Link
                      to={`/developers/${conn.user.username}`}
                      className="flex items-center gap-3"
                    >
                      {conn.user.profilePicture ? (
                        <img
                          src={conn.user.profilePicture}
                          alt={conn.user.name}
                          className="w-10 h-10 rounded-full object-cover border border-border"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="w-10 h-10 rounded-full bg-bg-tertiary border border-border items-center justify-center text-accent font-bold"
                        style={{
                          display: conn.user.profilePicture ? "none" : "flex",
                        }}
                      >
                        {conn.user.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-text-primary text-sm font-medium">
                          {conn.user.name}
                        </p>
                        <p className="text-text-secondary text-xs">
                          @{conn.user.username}
                        </p>
                      </div>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => handleRemove(conn.connectionId)}
                      disabled={actionLoadingId === conn.connectionId}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
