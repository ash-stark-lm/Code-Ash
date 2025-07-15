const TitleInput = ({ value, onChange }) => (
  <div>
    <label className="block text-sm mb-1">Title</label>
    <input
      className="w-full bg-black border border-[#333] p-2 rounded text-white"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter problem title"
    />
  </div>
)

export default TitleInput
