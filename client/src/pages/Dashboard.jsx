import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { dashboardService } from "../services/dashboardService";
import { requestService } from "../services/requestService";

const Dashboard = () => {
  const { user } = useAuth();
  const [myProjects, setMyProjects] = useState([]);
  const [joinedProjects, setJoinedProjects] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("my-projects");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [p1, p2, p3] = await Promise.all([
          dashboardService.getMyProjects(),
          dashboardService.getJoinedProjects(),
          dashboardService.getMyRequests(),
        ]);
        setMyProjects(p1.data);
        setJoinedProjects(p2.data);
        setMyRequests(p3.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const statusColor = {
    open: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    "in-progress": "text-amber-400 bg-amber-500/10 border-amber-500/20",
    completed: "text-slate-400 bg-slate-500/10 border-slate-500/20",
  };

  const requestStatusColor = {
    pending: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    accepted: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    rejected: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  const ProjectCard = ({ project }) => (
    <Link to={`/projects/${project._id}`} className="block bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-slate-600 hover:-translate-y-0.5 transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-white text-sm leading-snug">{project.title}</h3>
        <span className={`shrink-0 text-xs px-2 py-1 rounded-lg border capitalize ${statusColor[project.status]}`}>
          {project.status}
        </span>
      </div>
      <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-3">{project.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {project.technologies?.slice(0, 3).map((t) => (
          <span key={t} className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md font-mono">
            {t}
          </span>
        ))}
        {project.technologies?.length > 3 && (
          <span className="text-xs px-2 py-0.5 bg-slate-700 text-slate-400 rounded-md">+{project.technologies.length - 3}</span>
        )}
      </div>
    </Link>
  );

  const tabs = [
    { id: "my-projects", label: "My Projects", count: myProjects.length },
    { id: "joined", label: "Joined", count: joinedProjects.length },
    { id: "requests", label: "My Requests", count: myRequests.length },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Hey, {user?.name?.split(" ")[0]} 👋</h1>
            <p className="text-slate-400 text-sm mt-1">Here's what's happening with your projects.</p>
          </div>
          <Link to="/projects/create" className="bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "My Projects", value: myProjects.length, icon: "📁" },
            { label: "Joined Projects", value: joinedProjects.length, icon: "🤝" },
            { label: "Requests Sent", value: myRequests.length, icon: "📨" },
          ].map((s) => (
            <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
              <div className="w-11 h-11 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-xl">
                {s.icon}
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-slate-400 text-xs">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl w-fit mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? "bg-blue-500 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-blue-400" : "bg-slate-700 text-slate-300"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-slate-700 border-t-blue-400 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === "my-projects" && (
              <>
                {myProjects.length === 0 ? (
                  <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
                    <div className="text-4xl mb-3">🚀</div>
                    <h3 className="text-white font-semibold mb-2">No projects yet</h3>
                    <p className="text-slate-400 text-sm mb-5">Create your first project and find collaborators.</p>
                    <Link to="/projects/create" className="bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
                      Create Project
                    </Link>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myProjects.map((p) => <ProjectCard key={p._id} project={p} />)}
                  </div>
                )}
              </>
            )}

            {activeTab === "joined" && (
              <>
                {joinedProjects.length === 0 ? (
                  <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
                    <div className="text-4xl mb-3">🤝</div>
                    <h3 className="text-white font-semibold mb-2">No joined projects</h3>
                    <p className="text-slate-400 text-sm mb-5">Browse projects and request to join one.</p>
                    <Link to="/explore" className="bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
                      Explore Projects
                    </Link>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {joinedProjects.map((p) => <ProjectCard key={p._id} project={p} />)}
                  </div>
                )}
              </>
            )}

            {activeTab === "requests" && (
              <>
                {myRequests.length === 0 ? (
                  <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
                    <div className="text-4xl mb-3">📭</div>
                    <h3 className="text-white font-semibold mb-2">No requests sent</h3>
                    <p className="text-slate-400 text-sm">Browse projects and send join requests.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myRequests.map((req) => (
                      <div key={req._id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between gap-4">
                        <div>
                          <Link to={`/projects/${req.project?._id}`} className="font-semibold text-white hover:text-blue-400 transition-colors text-sm">
                            {req.project?.title}
                          </Link>
                          <div className="flex gap-1.5 mt-2 flex-wrap">
                            {req.project?.technologies?.slice(0, 3).map((t) => (
                              <span key={t} className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md font-mono">{t}</span>
                            ))}
                          </div>
                        </div>
                        <span className={`shrink-0 text-xs px-3 py-1.5 rounded-lg border capitalize font-medium ${requestStatusColor[req.status]}`}>
                          {req.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;