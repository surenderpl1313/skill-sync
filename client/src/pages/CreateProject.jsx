import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectService } from "../services/projectService";

const CreateProject = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", technologies: [], status: "open" });
  const [techInput, setTechInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.technologies.includes(t)) {
      setForm({ ...form, technologies: [...form.technologies, t] });
    }
    setTechInput("");
  };

  const removeTech = (t) => setForm({ ...form, technologies: form.technologies.filter((x) => x !== t) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.technologies.length === 0) { setError("Add at least one technology"); return; }
    setLoading(true);
    try {
      const res = await projectService.create(form);
      navigate(`/projects/${res.data.project._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Create a Project</h1>
          <p className="text-slate-400 text-sm">Share your idea and find collaborators.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          {error && (
            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Project Title *</label>
              <input
                type="text" required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Recipe Sharing App"
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
              <textarea
                required rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe your project and what kind of collaborators you're looking for..."
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Technologies *</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(); } }}
                  placeholder="e.g. React (press Enter to add)"
                  className="flex-1 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button type="button" onClick={addTech} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-xl text-sm transition-colors">
                  Add
                </button>
              </div>
              {form.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.technologies.map((t) => (
                    <span key={t} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg font-mono">
                      {t}
                      <button type="button" onClick={() => removeTech(t)} className="text-blue-400/60 hover:text-red-400 transition-colors">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-sm border border-slate-700 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
                {loading ? "Creating..." : "🚀 Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;