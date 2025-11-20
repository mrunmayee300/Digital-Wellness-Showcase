import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWorks } from '../services/api.js';
import WorkShowcaseCard from '../components/WorkShowcaseCard.jsx';

/**
 * Home Page Component
 * Gallery-first landing experience with quick upload rail
 */
const HomePage = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const response = await getWorks({ sort: 'newest' });
        setWorks(response.works || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Unable to load gallery right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const featuredWorks = useMemo(() => works.slice(0, 5), [works]);

  return (
    <div className="relative overflow-hidden text-slate-100">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-900/30 via-slate-950 to-black"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <header className="space-y-6">
          <p className="inline-flex items-center rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">
            Digital Wellness
          </p>
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl">
              Your Guide to Mindful Tech Use & Digital Wellness.              </h1>
              <p className="text-lg text-slate-400">
              Boost Productivity With Focused Digital Use              </p>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-500/10">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                Quick actions
              </p>
              <div className="mt-4 space-y-3">
                <Link
                  to="/upload"
                  className="flex items-center justify-between rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-white shadow-lg shadow-cyan-500/30 transition hover:shadow-blue-500/30"
                >
                  <span className="font-semibold">Upload new project</span>
                  <span className="text-2xl">⬆️</span>
                </Link>
                <Link
                  to="/gallery"
                  className="flex items-center justify-between rounded-xl border border-slate-700/70 px-5 py-3 font-semibold text-slate-300 transition hover:border-cyan-400/60 hover:text-white"
                >
                  View full gallery
                  <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Latest gallery</p>
              <h2 className="text-3xl font-semibold text-white">Featured rows</h2>
            </div>
            <span className="text-sm text-slate-500">
              {works.length > 0 ? `${works.length} total submissions` : 'Fetching works...'}
            </span>
          </div>

          <div className="mt-8 space-y-6">
            {loading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, idx) => (
                  <div
                    key={`skeleton-${idx}`}
                    className="h-72 w-full animate-pulse rounded-2xl bg-slate-800/50"
                  ></div>
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-200">
                {error}
              </div>
            )}

            {!loading && !error && featuredWorks.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-700 p-12 text-center">
                <p className="text-lg font-semibold text-slate-100">No submissions yet.</p>
                <p className="mt-2 text-slate-400">Be the first to showcase your project!</p>
                <Link
                  to="/upload"
                  className="mt-6 inline-flex items-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/30 transition"
                >
                  Upload now
                </Link>
              </div>
            )}

            {!loading &&
              !error &&
              featuredWorks.map((work) => <WorkShowcaseCard key={work._id} work={work} />)}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
