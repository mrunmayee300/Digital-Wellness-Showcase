import { Link } from 'react-router-dom';

const WorkShowcaseCard = ({ work }) => {
  if (!work) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isImage = work.fileType === 'image';
  const isVideo = work.fileType === 'video';

  const getCategoryPill = (category) => {
    const map = {
      Comic: 'border border-purple-500/40 bg-purple-500/10 text-purple-100',
      Website: 'border border-blue-500/40 bg-blue-500/10 text-blue-100',
      Magazine: 'border border-pink-500/40 bg-pink-500/10 text-pink-100',
      Skit: 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-100',
      Other: 'border border-slate-500/40 bg-slate-500/10 text-slate-100',
    };
    return map[category] || map.Other;
  };

  const getFileTypeEmoji = (type) => {
    switch (type) {
      case 'image':
        return '🖼️';
      case 'video':
        return '🎥';
      case 'pdf':
        return '📄';
      case 'zip':
        return '📦';
      default:
        return '📁';
    }
  };

  return (
    <Link
      to={`/work/${work._id}`}
      className="group flex flex-col gap-6 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-2xl shadow-black/30 transition hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-cyan-500/20 lg:flex-row"
    >
      <div className="relative w-full overflow-hidden rounded-2xl bg-slate-900 lg:w-2/3">
        {isImage && (
          <img
            src={work.fileUrl}
            alt={work.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        )}
        {isVideo && (
          <video
            src={work.fileUrl}
            muted
            className="h-full w-full object-cover"
          />
        )}
        {!isImage && !isVideo && (
          <div className="flex h-72 items-center justify-center text-6xl text-slate-500">
            {getFileTypeEmoji(work.fileType)}
          </div>
        )}
        <span
          className={`absolute left-4 top-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getCategoryPill(
            work.category,
          )}`}
        >
          {work.category}
        </span>
      </div>

      <div className="flex w-full flex-col justify-between rounded-2xl bg-slate-950/60 p-6 lg:w-1/3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            {formatDate(work.timestamp)}
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white transition group-hover:text-cyan-300">
            {work.title}
          </h3>
          <p className="mt-3 line-clamp-4 text-sm text-slate-400">
            {work.description}
          </p>
        </div>
        <div className="mt-6 flex justify-between border-t border-slate-800 pt-4 text-sm">
          <div>
            <p className="font-semibold text-white">{work.name}</p>
            <p className="text-slate-400">{work.roll}</p>
          </div>
          <div className="text-right text-slate-500">
            View story →
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WorkShowcaseCard;
