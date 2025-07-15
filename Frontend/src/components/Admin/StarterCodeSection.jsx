const StarterCodeSection = ({ codes, setCodes }) => {
  const updateCode = (idx, field, value) => {
    setCodes((prev) =>
      prev.map((code, i) => (i === idx ? { ...code, [field]: value } : code))
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-[#0FA] mb-2">Starter Code</h2>
      {codes.map((code, idx) => (
        <div key={idx} className="space-y-2 mb-4">
          <label className="text-sm">{code.language.toUpperCase()}</label>
          <textarea
            className="w-full bg-black border border-[#333] p-2 rounded text-white min-h-[100px]"
            placeholder={`Boilerplate code for ${code.language}`}
            value={code.boilerPlateCode}
            onChange={(e) => updateCode(idx, 'boilerPlateCode', e.target.value)}
          />
        </div>
      ))}
    </div>
  )
}

export default StarterCodeSection
