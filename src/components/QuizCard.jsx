import RussianKeyboard from './RussianKeyboard';

export default function QuizCard({ 
  current, 
  index, 
  total, 
  userInput, 
  setUserInput, 
  isCorrect, 
  showAnswer, 
  showHint, 
  setShowHint, 
  checkResult, 
  nextCard, 
  handleVirtualKey,
  parts,
  flagged,
  toggleFlag
}) {
  return (
    <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full border border-slate-700">
      {/* 1. Progress Bar */}
      <div className="w-full bg-slate-700 h-1.5 rounded-full mb-6 overflow-hidden">
        <div
          className="bg-cyan-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        ></div>
      </div>

      {/* 2. Star Toggle */}
      <div className="flex justify-end mb-2">
        <button
          onClick={toggleFlag}
          className={`text-2xl transition-colors ${flagged.includes(current.id) ? 'text-yellow-400' : 'text-slate-600 hover:text-slate-400'}`}
        >
          {flagged.includes(current.id) ? '★' : '☆'}
        </button>
      </div>

      {/* 3. Sentence Display */}
      <div className="text-xl mb-6 text-center leading-relaxed">
        {parts[0]}
        <span className="font-bold text-cyan-400"> [...] </span>
        {parts[2]}
      </div>

      {/* 4. Form Logic */}
      <form onSubmit={checkResult} className="space-y-4">
        <div className="text-center min-h-[2rem]">
          {showHint ? (
            <div className="animate-in fade-in duration-300">
              <span className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Target:</span>
              <span className="ml-2 text-cyan-300 font-medium">{current.hint}</span>
            </div>
          ) : (
            !showAnswer && (
              <button 
                type="button" 
                onClick={() => setShowHint(true)} 
                className="text-xs text-slate-500 hover:text-cyan-400 uppercase tracking-widest border border-slate-700 px-3 py-1 rounded-full"
              >
                Need a hint?
              </button>
            )
          )}
        </div>

        {!showAnswer ? (
          <>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type in Russian..."
              className={`w-full p-3 rounded-lg bg-slate-700 border-2 outline-none transition-all 
                ${isCorrect === true ? 'border-green-500' : isCorrect === false ? 'border-red-500' : 'border-slate-600 focus:border-cyan-500'}`}
              autoFocus
            />
            <RussianKeyboard onKeyPress={handleVirtualKey} />
            <button type="submit" className="w-full py-3 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-900">
              Check Answer
            </button>
          </>
        ) : (
          <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
            <button
              type="button"
              onClick={nextCard}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all ${isCorrect ? 'bg-green-600 hover:bg-green-500' : 'bg-slate-600 hover:bg-slate-500'}`}
            >
              {isCorrect ? "Correct! Next →" : "Next Sentence →"}
            </button>
            <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
              <p className="text-yellow-400 font-bold mb-1">{current.target}</p>
              <p className="text-slate-300 italic">{current.translation}</p>
              {current.note && <p className="text-[10px] text-cyan-500 mt-2 uppercase tracking-tighter">{current.note}</p>}
            </div>
          </div>
        )}
      </form>

      {/* 5. Footer Counter */}
      <div className="mt-6 flex justify-center items-center gap-2">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Sentence</span>
        <span className="px-2 py-0.5 bg-slate-700 text-cyan-400 rounded text-xs font-bold">
          {index + 1} / {total}
        </span>
      </div>
    </div>
  );
}