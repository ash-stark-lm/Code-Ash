const DescriptionInput = ({ value, onChange }) => (
  <div>
    <label className="block text-sm mb-1">Description</label>
    <textarea
      className="w-full bg-black border border-[#333] p-2 rounded text-white min-h-[100px]"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter problem description"
    />
  </div>
)

export default DescriptionInput
