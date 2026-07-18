import { useState, useEffect } from "react";
import Button from "./Button";
import api from "../../api/axios";

const ConnectButton = ({ targetUserId }) => {
  const [status, setStatus] = useState(null); // not_connected | pending_sent | pending_received | connected
  const [connectionId, setConnectionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStatus = async () => {
    try {
      const { data } = await api.get(`/connections/status/${targetUserId}`);
      setStatus(data.status);
      setConnectionId(data.connectionId || null);
    } catch (err) {
      setError("Failed to load connection status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [targetUserId]);

  const handleConnect = async () => {
    setActionLoading(true);
    setError("");
    try {
      await api.post(`/connections/request/${targetUserId}`);
      await fetchStatus();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAccept = async () => {
    setActionLoading(true);
    setError("");
    try {
      await api.put(`/connections/accept/${connectionId}`);
      await fetchStatus();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to accept request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    setError("");
    try {
      await api.put(`/connections/reject/${connectionId}`);
      await fetchStatus();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemove = async () => {
    setActionLoading(true);
    setError("");
    try {
      await api.delete(`/connections/${connectionId}`);
      await fetchStatus();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove connection");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Button variant="secondary" disabled>
        Loading...
      </Button>
    );
  }

  return (
    <div>
      {error && <p className="text-danger text-xs mb-2">{error}</p>}

      {status === "not_connected" && (
        <Button
          variant="primary"
          onClick={handleConnect}
          disabled={actionLoading}
        >
          {actionLoading ? "Sending..." : "+ Connect"}
        </Button>
      )}

      {status === "pending_sent" && (
        <Button variant="secondary" disabled>
          Request Sent
        </Button>
      )}

      {status === "pending_received" && (
        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={handleAccept}
            disabled={actionLoading}
          >
            Accept
          </Button>
          <Button
            variant="ghost"
            onClick={handleReject}
            disabled={actionLoading}
          >
            Reject
          </Button>
        </div>
      )}

      {status === "connected" && (
        <Button
          variant="secondary"
          onClick={handleRemove}
          disabled={actionLoading}
        >
          {actionLoading ? "Removing..." : "✓ Connected (Remove)"}
        </Button>
      )}
    </div>
  );
};

export default ConnectButton;
