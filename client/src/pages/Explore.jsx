import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { projectService } from "../services/projectService";

const Explore = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [techFilter, setTechFilter] = useState("");

  const fetchProjects = async () => {
    setLoading(true);
    try {
      let res;
      if (search || techFilter) {
        res = await projectService.search({
          name: search || undefined,
          tech: techFilter || undefined,
        });
      } else {
        res = await projectService.getAll();
      }
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const statusColor = {
    open: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    "in-progress": "text-amber-400 bg-amber-500/10 border-amber-500/20",
    completed: "text-slate-400 bg-slate-500/10 border-slate-500/20",
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Explore Projects</h1>
          <p className="text-slate-400 text-sm">Find your next collaboration.</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8 flex-wrap">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by project name..."
            className="flex-1 min-w-[200px] bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
          <input
            type="text"
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value)}
            placeholder="Filter by tech (e.g. React)"
            className="w-52 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button type="submit" className="bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors">
            Search
          </button>
          {(search || techFilter) && (
            <button
              type="button"
              onClick={() => { setSearch(""); setTechFilter(""); setTimeout(fetchProjects, 100); }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm px-4 py-3 rounded-xl border border-slate-700 transition-colors"
            >
              Clear
            </button>
          )}
        </form>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-slate-700 border-t-blue-400 rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-white font-semibold mb-2">No projects found</h3>
            <p className="text-slate-400 text-sm">Try different search terms.</p>
          </div>
        ) : (
          <>
            <p className="text-slate-500 text-sm mb-4">{projects.length} project{projects.length !== 1 ? "s" : ""} found</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((project) => (
                <Link key={project._id} to={`/projects/${project._id}`} className="group block bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-600 hover:-translate-y-1 transition-all">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors leading-snug">{project.title}</h3>
                    <span className={`shrink-0 text-xs px-2 py-1 rounded-lg border capitalize ${statusColor[project.status]}`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies?.slice(0, 4).map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md font-mono">{t}</span>
                    ))}
                    {project.technologies?.length > 4 && (
                      <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md">+{project.technologies.length - 4}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                      {project.owner?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs text-slate-500">{project.owner?.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;