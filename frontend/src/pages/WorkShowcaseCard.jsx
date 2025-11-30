import { Link } from 'react-router-dom';

const WorkShowcaseCard = ({ work }) => {
  return (
    <div className="rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl shadow-black/40 overflow-hidden backdrop-blur">
      
      {/* Image container with small padding */}
      <div className="p-2 bg-slate-950 rounded-t-2xl">
        <img
          src={work.image}
          alt={work.title}
          className="w-full h-72 object-contain rounded-xl bg-black"
        />
      </div>

      {/* Details section */}
      <div className="p-4 text-center">
        <p className="font-medium text-white text-lg truncate">
          {work.title || 'Untitled Work'}
        </p>

        <Link
          to={`/work/${work._id}`}
          className="mt-3 inline-block text-sm font-semibold text-cyan-400 hover:text-cyan-300"
        >
          View Project →
        </Link>
      </div>
    </div>
  );
};

export default WorkShowcaseCard;
