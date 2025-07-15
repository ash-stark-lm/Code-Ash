import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Dropdown from '../DropDown'

const generateMergeSortSteps = (arr) => {
  const steps = []

  const mergeSort = (array, left, right, level, index) => {
    if (left >= right) {
      steps.push({
        type: 'base',
        array: [array[left]],
        indices: [left],
        level,
        index,
        explanation: `Base case: [${array[left]}]`,
      })
      return [array[left]]
    }

    const mid = Math.floor((left + right) / 2)

    steps.push({
      type: 'split',
      array: array.slice(left, right + 1),
      indices: [left, mid, right],
      level,
      index,
      explanation: `Split: left=${left}, mid=${mid}, right=${right}`,
    })

    const leftSorted = mergeSort(array, left, mid, level + 1, index * 2)
    const rightSorted = mergeSort(
      array,
      mid + 1,
      right,
      level + 1,
      index * 2 + 1
    )

    const merged = []
    let i = 0,
      j = 0,
      k = left

    while (i < leftSorted.length && j < rightSorted.length) {
      const leftVal = leftSorted[i]
      const rightVal = rightSorted[j]

      steps.push({
        type: 'compare',
        level: level + 1,
        index: index * 2,
        array: [...leftSorted],
        compareIndices: [i],
        explanation: `Compare ${leftVal} and ${rightVal}`,
      })
      steps.push({
        type: 'compare',
        level: level + 1,
        index: index * 2 + 1,
        array: [...rightSorted],
        compareIndices: [j],
        explanation: `Compare ${leftVal} and ${rightVal}`,
      })

      if (leftVal < rightVal) {
        merged.push(leftVal)
        steps.push({
          type: 'merge-step',
          array: [...merged],
          level,
          index,
          explanation: `Place ${leftVal} into position ${k}`,
        })
        i++
      } else {
        merged.push(rightVal)
        steps.push({
          type: 'merge-step',
          array: [...merged],
          level,
          index,
          explanation: `Place ${rightVal} into position ${k}`,
        })
        j++
      }
      k++
    }

    while (i < leftSorted.length) {
      merged.push(leftSorted[i])
      steps.push({
        type: 'merge-step',
        array: [...merged],
        level,
        index,
        explanation: `Place ${leftSorted[i]} into position ${k}`,
      })
      i++
      k++
    }

    while (j < rightSorted.length) {
      merged.push(rightSorted[j])
      steps.push({
        type: 'merge-step',
        array: [...merged],
        level,
        index,
        explanation: `Place ${rightSorted[j]} into position ${k}`,
      })
      j++
      k++
    }

    steps.push({
      type: 'merge',
      array: merged,
      level,
      index,
      explanation: `Merged: [${merged.join(', ')}]`,
    })

    return merged
  }

  mergeSort(arr, 0, arr.length - 1, 0, 0)
  return steps
}

const ArrayBlock = ({
  array,
  level,
  index,
  highlightIndices = [],
  explanation,
}) => {
  const totalWidth = 1000
  const blocksPerRow = Math.pow(2, level)
  const widthPerBlock = totalWidth / blocksPerRow
  const left = index * widthPerBlock

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="absolute"
      style={{
        top: `${level * 140}px`,
        left: `${left}px`,
        width: `${widthPerBlock}px`,
      }}
    >
      <div className="flex justify-center gap-1">
        {array.map((val, idx) => (
          <div
            key={idx}
            className={`w-10 h-10 text-center text-sm rounded border flex flex-col items-center justify-center bg-[#1a1a1a] ${
              highlightIndices.includes(idx)
                ? 'border-yellow-400 text-yellow-400'
                : 'border-gray-600'
            }`}
          >
            {val}
            <div className="text-[10px] text-gray-500">{idx}</div>
          </div>
        ))}
      </div>
      {explanation && (
        <div className="mt-1 text-sm text-gray-400 text-center max-w-xs whitespace-nowrap overflow-hidden overflow-ellipsis">
          {explanation}
        </div>
      )}
    </motion.div>
  )
}

const MergeSortVisualizer = () => {
  const [array, setArray] = useState([5, 3, 8, 4, 2, 6, 1, 7])
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [language, setLanguage] = useState('c++')

  useEffect(() => {
    const s = generateMergeSortSteps(array)
    setSteps(s)
  }, [array])

  const stepSlice = steps.slice(0, currentStep + 1)
  const rendered = {}

  stepSlice.forEach((s) => {
    if (['base', 'split', 'compare', 'merge', 'merge-step'].includes(s.type)) {
      rendered[`${s.level}-${s.index}`] = (
        <ArrayBlock
          key={`${s.level}-${s.index}`}
          array={s.array || []}
          level={s.level}
          index={s.index || 0}
          highlightIndices={s.compareIndices || []}
          explanation={s.explanation}
        />
      )
    }
  })

  const codeSnippets = {
    'c++': `void merge(vector<int>& arr, int l, int m, int r) {
  int n1 = m - l + 1;
  int n2 = r - m;
  vector<int> L(n1), R(n2);
  for (int i = 0; i < n1; i++) L[i] = arr[l + i];
  for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
  int i = 0, j = 0, k = l;
  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) arr[k++] = L[i++];
    else arr[k++] = R[j++];
  }
  while (i < n1) arr[k++] = L[i++];
  while (j < n2) arr[k++] = R[j++];
}

void mergeSort(vector<int>& arr, int l, int r) {
  if (l < r) {
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
  }
}`,
    python: `def merge_sort(arr):
  if len(arr) <= 1:
    return arr
  mid = len(arr) // 2
  left = merge_sort(arr[:mid])
  right = merge_sort(arr[mid:])
  return merge(left, right)

def merge(left, right):
  result = []
  i = j = 0
  while i < len(left) and j < len(right):
    if left[i] < right[j]:
      result.append(left[i])
      i += 1
    else:
      result.append(right[j])
      j += 1
  result.extend(left[i:])
  result.extend(right[j:])
  return result`,
    java: `void merge(int[] arr, int l, int m, int r) {
  int n1 = m - l + 1;
  int n2 = r - m;
  int[] L = new int[n1];
  int[] R = new int[n2];
  for (int i = 0; i < n1; ++i) L[i] = arr[l + i];
  for (int j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];
  int i = 0, j = 0, k = l;
  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) arr[k++] = L[i++];
    else arr[k++] = R[j++];
  }
  while (i < n1) arr[k++] = L[i++];
  while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int[] arr, int l, int r) {
  if (l < r) {
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
  }
}`,
  }

  return (
    <div className="p-6 min-h-screen bg-[#0d0d0d] text-white font-mono overflow-x-hidden relative">
      <h1 className="text-2xl font-bold mb-6 text-[#0FA]">
        🧬 Merge Sort Visualizer
      </h1>
      {/* Description and Code Section */}
      <div className="mt-12 bg-[#111] border border-[#333] rounded-xl p-4 flex flex-col md:flex-row gap-4 mb-12">
        {/* Left: Explanation Section */}
        <div className="flex-1">
          <h1 className="text-lg text-white font-semibold mb-2">
            What is Merge Sort?
          </h1>
          <p className="text-sm text-gray-300 mb-2">
            Merge Sort is a divide-and-conquer algorithm. It splits the array
            into halves recursively, sorts them, and then merges the sorted
            halves.
          </p>

          <h2 className="text-md text-white font-semibold mb-1">
            🔍 Core Logic:
          </h2>
          <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
            <li>Divide the array into two halves recursively.</li>
            <li>Sort each half.</li>
            <li>Merge the sorted halves into a single sorted array.</li>
          </ul>
          <p className="text-sm text-gray-300 mt-2">
            🧠 Time Complexity: O(n log n)
          </p>
          <p className="text-sm text-gray-300">💾 Space Complexity: O(n)</p>
        </div>

        {/* Right: Code Section */}
        <div className="flex-1 bg-[#1a1a1a] rounded-lg p-3 border border-[#333]">
          <h3 className="text-lg text-white font-semibold mb-2">
            📜 Merge Sort Code
          </h3>
          <Dropdown
            label="lang:"
            options={['c++', 'python', 'java']}
            selected={language}
            setSelected={setLanguage}
          />
          <pre className="text-sm text-green-400 whitespace-pre-wrap">
            {codeSnippets[language]}
          </pre>
        </div>
      </div>

      <div className="mb-4 sticky top-0 z-10 bg-[#0d0d0d] py-2">
        <button
          className="px-4 py-2 gap-5 mr-5 bg-red-800/10 border border-red-500 text-red-400 rounded hover:bg-red-800/20"
          onClick={() => setCurrentStep((s) => Math.max(s - 1, 0))}
        >
          Prev Step
        </button>
        <button
          className="px-4 py-2 bg-[#0FA]/10 border border-[#0FA] text-[#0FA] rounded hover:bg-[#0FA]/20"
          onClick={() =>
            setCurrentStep((s) => Math.min(s + 1, steps.length - 1))
          }
        >
          Next Step
        </button>
      </div>

      <div className="relative min-h-[1400px] left-40 w-full">
        {Object.entries(rendered).map(([key, value]) => (
          <React.Fragment key={key}>{value}</React.Fragment>
        ))}
      </div>
    </div>
  )
}
export default MergeSortVisualizer
