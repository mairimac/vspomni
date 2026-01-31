export default function SuccessScreen({ onRestart }) {
  return (
    <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700 text-center animate-in zoom-in duration-300">
      <div className="py-10">
        <h2 className="text-4xl mb-4 animate-bounce">🎉</h2>
        <h2 className="text-2xl font-bold text-white mb-2">Excellent Work!</h2>
        <p className="text-slate-400 mb-6">You've completed today's sentences.</p>
        <button
          onClick={onRestart}
          className="px-6 py-2 bg-cyan-500 text-slate-900 font-bold rounded-lg hover:bg-cyan-400 transition-all shadow-lg active:scale-95"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}