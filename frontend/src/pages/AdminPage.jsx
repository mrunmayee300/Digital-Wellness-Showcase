import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';

export default function AdminPage() {
  const [pendings, setPendings] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'projects'), where('approved', '==', false));
    const unsub = onSnapshot(q, (snap) => {
      const arr = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setPendings(arr);
    }, err => {
      console.error('admin snapshot err', err);
    });

    return () => unsub();
  }, []);

  const approve = async (id) => {
    try {
      await updateDoc(doc(db, 'projects', id), { approved: true });
      alert('Approved');
    } catch (err) {
      console.error(err);
      alert('Approve failed');
    }
  };

  const reject = async (id) => {
    try {
      await updateDoc(doc(db, 'projects', id), { rejected: true });
      alert('Rejected (marked).');
    } catch (err) {
      console.error(err);
      alert('Reject failed');
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 text-slate-100">
      <h2 className="text-2xl font-semibold mb-6">Admin — Pending Uploads</h2>

      {pendings.length === 0 && <div className="text-slate-400">No pending uploads.</div>}

      <div className="space-y-4">
        {pendings.map(p => (
          <div key={p.id} className="rounded-2xl border border-slate-800 p-4 bg-slate-900/60">
            <div className="flex items-start gap-4">
              <div className="w-28 h-20 bg-black rounded overflow-hidden flex items-center justify-center">
                {p.type === 'image' ? <img src={p.link || '/placeholder.png'} alt={p.title} className="object-contain max-h-full max-w-full" /> : <div className="text-slate-300">{p.type.toUpperCase()}</div>}
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-sm text-slate-300">{p.desc}</p>
                <p className="text-xs text-slate-400 mt-2">By: {p.uploaderEmail}</p>

                <div className="mt-3 flex gap-2">
                  <button onClick={() => approve(p.id)} className="px-3 py-1 rounded bg-emerald-500 text-black">Approve</button>
                  <button onClick={() => reject(p.id)} className="px-3 py-1 rounded bg-red-600 text-white">Reject</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
