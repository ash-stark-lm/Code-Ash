import Select from 'react-select'

const TAG_OPTIONS = [
  { label: 'Array', value: 'Array' },
  { label: 'String', value: 'String' },
  { label: 'Dynamic Programming', value: 'Dynamic Programming' },
  { label: 'Math', value: 'Math' },
  { label: 'Sorting', value: 'Sorting' },
  { label: 'Greedy', value: 'Greedy' },
  { label: 'Depth-First Search', value: 'Depth-First Search' },
  { label: 'Binary Search', value: 'Binary Search' },
  { label: 'Database', value: 'Database' },
  { label: 'Matrix', value: 'Matrix' },
  { label: 'Tree', value: 'Tree' },
  { label: 'Bit Manipulation', value: 'Bit Manipulation' },
  { label: 'Breadth-First Search', value: 'Breadth-First Search' },
  { label: 'Two Pointers', value: 'Two Pointers' },
  { label: 'Prefix Sum', value: 'Prefix Sum' },
  { label: 'Heap (Priority Queue)', value: 'Heap (Priority Queue)' },
  { label: 'Simulation', value: 'Simulation' },
  { label: 'Binary Tree', value: 'Binary Tree' },
  { label: 'Stack', value: 'Stack' },
  { label: 'Graph', value: 'Graph' },
  { label: 'Counting', value: 'Counting' },
  { label: 'Sliding Window', value: 'Sliding Window' },
  { label: 'Design', value: 'Design' },
  { label: 'Enumeration', value: 'Enumeration' },
  { label: 'Backtracking', value: 'Backtracking' },
  { label: 'Union Find', value: 'Union Find' },
  { label: 'Linked List', value: 'Linked List' },
  { label: 'Number Theory', value: 'Number Theory' },
  { label: 'Ordered Set', value: 'Ordered Set' },
  { label: 'Monotonic Stack', value: 'Monotonic Stack' },
  { label: 'Segment Tree', value: 'Segment Tree' },
  { label: 'Trie', value: 'Trie' },
  { label: 'Combinatorics', value: 'Combinatorics' },
  { label: 'Bitmask', value: 'Bitmask' },
  { label: 'Queue', value: 'Queue' },
  { label: 'Recursion', value: 'Recursion' },
  { label: 'Divide and Conquer', value: 'Divide and Conquer' },
  { label: 'Binary Indexed Tree', value: 'Binary Indexed Tree' },
  { label: 'Memoization', value: 'Memoization' },
  { label: 'Geometry', value: 'Geometry' },
  { label: 'Hash Function', value: 'Hash Function' },
  { label: 'Binary Search Tree', value: 'Binary Search Tree' },
  { label: 'String Matching', value: 'String Matching' },
  { label: 'Topological Sort', value: 'Topological Sort' },
  { label: 'Shortest Path', value: 'Shortest Path' },
  { label: 'Rolling Hash', value: 'Rolling Hash' },
  { label: 'Game Theory', value: 'Game Theory' },
  { label: 'Interactive', value: 'Interactive' },
  { label: 'Data Stream', value: 'Data Stream' },
  { label: 'Monotonic Queue', value: 'Monotonic Queue' },
  { label: 'Brainteaser', value: 'Brainteaser' },
  { label: 'Doubly-Linked List', value: 'Doubly-Linked List' },
  { label: 'Randomized', value: 'Randomized' },
  { label: 'Merge Sort', value: 'Merge Sort' },
  { label: 'Counting Sort', value: 'Counting Sort' },
  { label: 'Iterator', value: 'Iterator' },
  { label: 'Concurrency', value: 'Concurrency' },
  { label: 'Probability and Statistics', value: 'Probability and Statistics' },
  { label: 'Quickselect', value: 'Quickselect' },
  { label: 'Suffix Array', value: 'Suffix Array' },
  { label: 'Line Sweep', value: 'Line Sweep' },
  { label: 'Minimum Spanning Tree', value: 'Minimum Spanning Tree' },
  { label: 'Bucket Sort', value: 'Bucket Sort' },
  { label: 'Shell', value: 'Shell' },
  { label: 'Reservoir Sampling', value: 'Reservoir Sampling' },
  {
    label: 'Strongly Connected Component',
    value: 'Strongly Connected Component',
  },
  { label: 'Eulerian Circuit', value: 'Eulerian Circuit' },
  { label: 'Radix Sort', value: 'Radix Sort' },
]

const customStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: '#111',
    borderColor: '#0FA',
    borderWidth: '1px',
    borderRadius: '0.5rem',
    color: '#fff',
    boxShadow: 'none',
    padding: '0.2rem 0.3rem',
    minHeight: '2.5rem',
    fontSize: '0.9rem',
    cursor: 'pointer',
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected ? '#0FA' : isFocused ? '#222' : '#111',
    color: isSelected ? '#111' : '#fff',
    padding: '0.5rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#111',
    zIndex: 50,
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#0FA2',
    color: '#fff',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#fff',
  }),
  /*************  ✨ Windsurf Command ⭐  *************/
  // Custom styles for the X button to remove a selected value
  // in the multi-value dropdown. The X is white and the background
  // is transparent until hovered, when the background becomes #0FA
  // and the X becomes black.
  /*******  6d160781-d9ed-4809-9ab6-fa64febc979a  *******/
  multiValueRemove: (base) => ({
    ...base,
    color: '#fff',
    ':hover': {
      backgroundColor: '#0FA',
      color: '#000',
    },
  }),
  input: (base) => ({
    ...base,
    color: '#fff',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#aaa',
  }),
}

const TagSelector = ({ value, onChange }) => (
  <div data-lenis-prevent>
    <div className="w-full">
      <label className="block text-sm mb-1 text-white">Tags</label>
      <Select
        isMulti
        value={value}
        onChange={onChange}
        options={TAG_OPTIONS}
        styles={customStyles}
        placeholder="Select tags..."
      />
    </div>
  </div>
)

export default TagSelector
