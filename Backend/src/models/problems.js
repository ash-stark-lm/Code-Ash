import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const problemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    tags: [
      {
        type: String,
        enum: [
          'Array',
          'String',
          'Hash Table',
          'Dynamic Programming',
          'Math',
          'Sorting',
          'Greedy',
          'Depth-First Search',
          'Binary Search',
          'Database',
          'Matrix',
          'Tree',
          'Bit Manipulation',
          'Breadth-First Search',
          'Two Pointers',
          'Prefix Sum',
          'Heap (Priority Queue)',
          'Simulation',
          'Binary Tree',
          'Stack',
          'Graph',
          'Counting',
          'Sliding Window',
          'Design',
          'Enumeration',
          'Backtracking',
          'Union Find',
          'Linked List',
          'Number Theory',
          'Ordered Set',
          'Monotonic Stack',
          'Segment Tree',
          'Trie',
          'Combinatorics',
          'Bitmask',
          'Queue',
          'Recursion',
          'Divide and Conquer',
          'Binary Indexed Tree',
          'Memoization',
          'Geometry',
          'Hash Function',
          'Binary Search Tree',
          'String Matching',
          'Topological Sort',
          'Shortest Path',
          'Rolling Hash',
          'Game Theory',
          'Interactive',
          'Data Stream',
          'Monotonic Queue',
          'Brainteaser',
          'Doubly-Linked List',
          'Randomized',
          'Merge Sort',
          'Counting Sort',
          'Iterator',
          'Concurrency',
          'Probability and Statistics',
          'Quickselect',
          'Suffix Array',
          'Line Sweep',
          'Minimum Spanning Tree',
          'Bucket Sort',
          'Shell',
          'Reservoir Sampling',
          'Strongly Connected Component',
          'Eulerian Circuit',
          'Radix Sort',
        ],
        required: true,
      },
    ],

    visibleTestCases: [
      {
        input: {
          type: String,
          required: true,
        },
        output: {
          type: String,
          required: true,
        },
        explanation: {
          type: String,
        },
      },
    ],

    hiddenTestCases: [
      {
        input: {
          type: String,
          required: true,
        },
        output: {
          type: String,
          required: true,
        },
      },
    ],

    problemCreator: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },

    starterCode: [
      {
        language: {
          type: String,
          enum: ['c++', 'c', 'java', 'python', 'javascript'], // fixed casing
          required: true,
        },
        boilerPlateCode: {
          type: String,
          required: true,
        },
      },
    ],

    referenceSolution: [
      {
        language: {
          type: String,
          enum: ['c++', 'c', 'java', 'python', 'javascript'], // fixed casing
          required: true,
        },
        completeCode: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Problem = mongoose.model('problems', problemSchema)

export default Problem
