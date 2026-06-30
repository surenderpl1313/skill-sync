import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { projectService } from "../services/projectService";
import { requestService } from "../services/requestService";
import { useAuth } from "../context/AuthContext";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await projectService.getById(id);
        setProject(res.data);
        if (res.data.owner._id === user?.id) {
          const reqRes = await requestService.getForProject(id);
          setRequests(reqRes.data);
        }
      } catch {
        navigate("/explore");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleJoinRequest = async () => {
    setRequestLoading(true);
    setError("");
    try {
      await requestService.send(id, message);
      setRequestSent(true);
      setMessage("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send request");
    } finally {
      setRequestLoading(false);
    }
  };

  const handleAccept = async (reqId) => {
    try {
      await requestService.accept(reqId);
      setRequests((prev) => prev.map((r) => r._id === reqId ? { ...r, status: "accepted" } : r));
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const handleReject = async (reqId) => {
    try {
      await requestService.reject(reqId);
      setRequests((prev) => prev.map((r) => r._id === reqId ? { ...r, status: "rejected" } : r));
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await projectService.delete(id);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const statusColor = {
    open: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    "in-progress": "text-amber-400 bg-amber-500/10 border-amber-500/20",
    completed: "text-slate-400 bg-slate-500/10 border-slate-500/20",
  };

  const reqStatusColor = {
    pending: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    accepted: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    rejected: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-slate-700 border-t-blue-400 rounded-full animate-spin" />
    </div>
  );

  if (!project) return null;

  const isOwner = project.owner._id === user?.id;

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl font-bold text-white">{project.title}</h1>
                <span className={`shrink-0 text-xs px-3 py-1.5 rounded-lg border capitalize ${statusColor[project.status]}`}>
                  {project.status}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm mb-5">{project.description}</p>
              <div className="mb-5">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">Technologies</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.map((t) => (
                    <span key={t} className="text-xs px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg font-mono">{t}</span>
                  ))}
                </div>
              </div>
              {isOwner && (
                <div className="flex gap-3 pt-5 border-t border-slate-800">
                  <Link to={`/projects/${id}/edit`} className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg border border-slate-700 transition-colors">
                    Edit
                  </Link>
                  <button onClick={handleDelete} className="text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg border border-red-500/20 transition-colors">
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Join Request */}
            {!isOwner && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4">
                  {requestSent ? "✅ Request Sent!" : "Request to Join"}
                </h3>
                {requestSent ? (
                  <p className="text-slate-400 text-sm">The project owner will review your request shortly.</p>
                ) : (
                  <div className="space-y-3">
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      placeholder="Introduce yourself and why you'd be a great fit..."
                      className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                    <button
                      onClick={handleJoinRequest}
                      disabled={requestLoading}
                      className="w-full bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
                    >
                      {requestLoading ? "Sending..." : "🤝 Send Join Request"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Owner: Requests */}
            {isOwner && requests.length > 0 && (
              <div>
                <h3 className="font-semibold text-white mb-4">Join Requests ({requests.length})</h3>
                <div className="space-y-3">
                  {requests.map((req) => (
                    <div key={req._id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {req.applicant?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{req.applicant?.name}</p>
                          <p className="text-slate-500 text-xs">{req.applicant?.email}</p>
                          {req.message && <p className="text-slate-400 text-xs mt-1 italic">"{req.message}"</p>}
                          {req.applicant?.skills?.length > 0 && (
                            <div className="flex gap-1 mt-2 flex-wrap">
                              {req.applicant.skills.slice(0, 3).map((s) => (
                                <span key={s} className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md font-mono">{s}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {req.status === "pending" ? (
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => handleAccept(req._id)} className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg transition-colors">Accept</button>
                          <button onClick={() => handleReject(req._id)} className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors">Reject</button>
                        </div>
                      ) : (
                        <span className={`shrink-0 text-xs px-3 py-1.5 rounded-lg border capitalize ${reqStatusColor[req.status]}`}>{req.status}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-4">Project Owner</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                  {project.owner?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{project.owner?.name}</p>
                  <p className="text-slate-500 text-xs">{project.owner?.email}</p>
                </div>
              </div>
              {project.owner?.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {project.owner.skills.slice(0, 4).map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md font-mono">{s}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Details</p>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Status</span>
                <span className={`text-xs px-2 py-1 rounded-lg border capitalize ${statusColor[project.status]}`}>{project.status}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Members</span>
                <span className="text-white font-medium">{project.members?.length || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Created</span>
                <span className="text-white font-medium">
                  {new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;