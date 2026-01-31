import { useState, useEffect } from 'react';
import RUSSIAN_DATA from './sentences.json';
import SuccessScreen from './components/SuccessScreen';
import QuizCard from './components/QuizCard';

function App() {
    // All states first
    const [index, setIndex] = useState(() => {
        const saved = localStorage.getItem('vspomni_progress');
        return saved ? parseInt(saved, 10) : 0;
    });

    const [flagged, setFlagged] = useState(() => {
        const saved = localStorage.getItem('vspomni_flagged');
        return saved ? JSON.parse(saved) : [];
    });

    const [streak, setStreak] = useState(() => {
        const saved = localStorage.getItem('vspomni_streak');
        return saved ? parseInt(saved, 10) : 0; // parseInt converts "5" back to 5
    });


    const [onlyHardMode, setOnlyHardMode] = useState(false);
    // Save flagged IDs whenever the list changes
    // --- EFFECT 1: Handles Flagging Persistence ---
    useEffect(() => {
        localStorage.setItem('vspomni_flagged', JSON.stringify(flagged));
    }, [flagged]); // Only runs when 'flagged' changes

    // --- EFFECT 2: Handles Streak Persistence ---
    useEffect(() => {
        localStorage.setItem('vspomni_streak', streak.toString());
    }, [streak]); // Only runs when 'streak' changes

    // --- EFFECT 3: Handles Progress (Index) Persistence ---
    useEffect(() => {
        localStorage.setItem('vspomni_progress', index.toString());
    }, [index]); // Only runs when 'index' changes
    // Derived data
    const activeData = onlyHardMode
        ? RUSSIAN_DATA.filter(item => flagged.includes(item.id))
        : RUSSIAN_DATA;

    const current = activeData[index] || activeData[0];


    // Current item

    const parts = current?.sentence ? current.sentence.split(/\[|\]/) : ["", "", ""];

    const handleVirtualKey = (char) => {
        setUserInput((prev) => prev + char);
    };

    const toggleFlag = () => {
        const currentId = current.id;
        setFlagged(prev =>
            prev.includes(currentId)
                ? prev.filter(id => id !== currentId)
                : [...prev, currentId]
        );
    };

    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [isCorrect, setIsCorrect] = useState(null); // null, true, or false
    const [showAnswer, setShowAnswer] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [isFinished, setIsFinished] = useState(false);


    const checkResult = (e) => {
        if (e) e.preventDefault();

        // Guard: Don't process if the answer is already shown
        if (showAnswer) return;

        // 1. The Logic (Local variable)
        const isRight = userInput.trim().toLowerCase() === current.target.toLowerCase();

        // 2. The Updates (Updating the states based on the logic)
        setIsCorrect(isRight);
        setShowAnswer(true);
        setAttempts(prev => prev + 1);

        if (isRight) {
            setScore(prev => prev + 1);
            setStreak(prev => prev + 1);
        } else {
            setStreak(0); // Reset streak on a miss
        }
    };
    //Guard clause
    if (onlyHardMode && activeData.length === 0) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-400">Your Hard Mode list is empty!</p>
                    <button onClick={() => setOnlyHardMode(false)} className="text-cyan-400">Go back</button>
                </div>
            </div>
        );
    }

    const nextCard = () => {
        // 1. Reset all UI states FIRST
        setShowAnswer(false);  // Brings keyboard back
        setUserInput("");     // Clears text box
        setIsCorrect(null);    // Resets colors
        setShowHint(false);    // Hides the hint

        // 2. Decide: Go to next card OR finish the session?
        if (index >= activeData.length - 1) {
            // If we are on the last card, trigger the Finish screen
            setIsFinished(true);
        } else {
            // Otherwise, move to the next index
            setIndex((prev) => prev + 1);
        }
    };


    const shuffleData = () => {
        if (window.confirm("Shuffle all sentences and restart?")) {
            // This creates a randomized version of your JSON data
            const shuffled = [...RUSSIAN_DATA].sort(() => Math.random() - 0.5);
            // Note: To make this truly permanent, you'd save the shuffled array 
            // to state, but for now, let's just reset the index.
            setIndex(0);
            setScore(0);
            setStreak(0);
            localStorage.removeItem('vspomni_progress');
            window.location.reload(); // Simplest way to fresh start
        }
    };




   return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-8 text-cyan-400 font-serif italic">Vspomni</h1>

        {isFinished ? (
            <SuccessScreen onRestart={() => { setIndex(0); setIsFinished(false); }} />
        ) : (
            <div className="w-full max-w-md space-y-4">
                {/* 1. CONTROL BAR */}
                <div className="flex gap-2 justify-center mb-2">
                    <button
                        onClick={() => { setOnlyHardMode(!onlyHardMode); setIndex(0); }}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg ${onlyHardMode ? 'bg-yellow-500 text-slate-900' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
                    >
                        {onlyHardMode ? 'HARD MODE: ON' : 'STUDY ALL CARDS'}
                    </button>

                    <button
                        onClick={shuffleData}
                        className="px-4 py-1.5 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 transition-all shadow-lg"
                    >
                        SHUFFLE 🔀
                    </button>
                </div>

                {/* 2. STATS BAR */}
                <div className="flex justify-between w-full px-1 text-xs font-mono text-slate-500">
                    <div>STREAK <span className="text-orange-500 font-bold">{streak} 🔥</span></div>
                    <div>ACCURACY <span className="text-cyan-400 font-bold">
                        {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%
                    </span></div>
                </div>

                {/* 3. THE QUIZ CARD */}
                <QuizCard
                    current={current}
                    index={index}
                    total={activeData.length}
                    userInput={userInput}
                    setUserInput={setUserInput}
                    isCorrect={isCorrect}
                    showAnswer={showAnswer}
                    showHint={showHint}
                    setShowHint={setShowHint}
                    setShowAnswer={setShowAnswer}
                    checkResult={checkResult}
                    nextCard={nextCard}
                    handleVirtualKey={handleVirtualKey}
                    parts={parts}
                    flagged={flagged}
                    toggleFlag={toggleFlag}
                />
            </div>
        )}
    </div>
);
}

export default App;