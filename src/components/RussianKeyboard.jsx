export default function RussianKeyboard({ onKeyPress }) {
  const keys = [
    ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ'],
    ['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э'],
    ['я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю']
  ];

  return (
    <div className="space-y-2 select-none">
      {keys.map((row, i) => (
        <div key={i} className="flex justify-center gap-1">
          {row.map(key => (
            <button
              key={key}
              type="button"
              onClick={() => onKeyPress(key)}
              className="w-8 h-10 sm:w-10 sm:h-12 bg-slate-600 hover:bg-slate-500 rounded text-white font-medium transition-colors uppercase"
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}