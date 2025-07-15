import Select from 'react-select'

const TAG_OPTIONS = [
  { label: 'Array', value: 'Array' },
  { label: 'String', value: 'String' },
  { label: 'Hash Table', value: 'Hash Table' },
  { label: 'Dynamic Programming', value: 'Dynamic Programming' },
  { label: 'Math', value: 'Math' },
  { label: 'Sorting', value: 'Sorting' },
  { label: 'Graph', value: 'Graph' },
  { label: 'Tree', value: 'Tree' },
  // Add more
]

const TagSelector = ({ value, onChange }) => (
  <div>
    <label className="block text-sm mb-1">Tags</label>
    <Select
      isMulti
      value={value}
      onChange={onChange}
      options={TAG_OPTIONS}
      className="text-black"
      placeholder="Select tags..."
    />
  </div>
)

export default TagSelector
