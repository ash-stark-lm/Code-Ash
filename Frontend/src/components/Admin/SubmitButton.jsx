const SubmitButton = ({ onClick }) => (
  <div className="pt-4">
    <button
      onClick={onClick}
      className="bg-[#0FA] text-black px-6 py-2 rounded-full font-semibold hover:bg-[#0fa]/90 transition"
    >
      Create Problem
    </button>
  </div>
)

export default SubmitButton
