import { useState } from "react";
import Button from "./Button";
import api from "../../api/axios";

const AIGenerateButton = ({
  type,
  onGenerated,
  label = "✨ Generate with AI",
}) => {
  const [open, setOpen] = useState(false);
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!keywords.trim()) {
      setError("Add a few keywords first");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/ai/generate", { type, keywords });
      onGenerated(data.text);
      setOpen(false);
      setKeywords("");
    } catch (err) {
      setError(
        err.response?.data?.message || "AI generation failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-accent hover:text-accent-hover text-xs"
      >
        {label}
      </button>
    );
  }

  return (
    <div className="bg-bg-tertiary border border-border rounded-lg p-3 mt-1.5 shadow-lg">
      {error && <p className="text-danger text-xs mb-2">{error}</p>}
      <textarea
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        rows={2}
        placeholder="e.g. backend dev, love Node, built 3 hackathon projects"
        className="w-full bg-bg-primary border border-border text-text-primary text-sm rounded-lg px-3 py-2.5 placeholder:text-text-muted focus:outline-none focus:border-accent resize-none mb-2 shadow-none appearance-none"
        style={{ boxShadow: "none" }}
      />
      <div className="flex gap-2">
        <Button variant="primary" onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setOpen(false);
            setError("");
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AIGenerateButton;
