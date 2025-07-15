const DifficultySelector = ({ value, onChange }) => (
  <div>
    <label className="block text-sm mb-1">Difficulty</label>
    <select
      className="w-full bg-black border border-[#333] p-2 rounded text-white"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="easy">Easy</option>
      <option value="medium">Medium</option>
      <option value="hard">Hard</option>
    </select>
  </div>
)

export default DifficultySelector
