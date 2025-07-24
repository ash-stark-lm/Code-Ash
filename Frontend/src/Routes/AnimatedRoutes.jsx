import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'

import { HomePage, Login, SignUp, Problems, ProblemPage } from '../pages'
import VisualizerPage from '../pages/VisualizerPage.jsx'
import CreateProblem from '../pages/Admin/CreateProblem.jsx'
import AdminPanel from '../pages/Admin/AdminPanel.jsx'
import ChatWithAI from '../components/ChatWithAI.jsx'
import ProfilePage from '../pages/ProfilePage.jsx'
import Editorial from '../components/Editorial.jsx'

// Admin Sub Routes
import ProblemListForUpdate from '../pages/Admin/ProblemList.jsx'
import UpdateProblem from '../pages/Admin/UpdateProblem'
import DeleteProblem from '../pages/Admin/DeleteProblem.jsx'

// Visualizer Components
import {
  BFSVisualizer,
  DFSVisualizer,
  BubbleSortVisualizer,
  BinarySearchVisualizer,
  DijkstraVisualizer,
  DoublyLinkedListVisualizer,
  FloodFillVisualizer,
  InorderTraversal,
  InsertionSortVisualizer,
  LinearSearchVisualizer,
  MaxHeapVisualizer,
  MinHeapVisualizer,
  MergeSortVisualizer,
  PostorderTraversal,
  PreorderTraversal,
  QueueVisualizer,
  SelectionSortVisualizer,
  SinglyLinkedListVisualizer,
  StackVisualizer,
} from '../components/Visualizer/index.jsx'

const AnimatedRoutes = () => {
  const location = useLocation()
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth Routes */}
        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/signup" />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <SignUp />}
        />
        <Route
          path="/problems"
          element={isAuthenticated ? <Problems /> : <Login />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfilePage /> : <Login />}
        />
        <Route
          path="/problem/:id"
          element={isAuthenticated ? <ProblemPage /> : <Login />}
        />

        {/* Visualizer Parent Route + Nested Routes */}
        <Route
          path="/visualizer"
          element={
            isAuthenticated ? <VisualizerPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/visualizer-linear-search"
          element={
            isAuthenticated ? (
              <LinearSearchVisualizer />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/visualizer-binary-search"
          element={
            isAuthenticated ? (
              <BinarySearchVisualizer />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/visualizer-selection-sort"
          element={
            isAuthenticated ? (
              <SelectionSortVisualizer />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/visualizer-bubble-sort"
          element={
            isAuthenticated ? (
              <BubbleSortVisualizer />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/visualizer-insertion-sort"
          element={
            isAuthenticated ? (
              <InsertionSortVisualizer />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/visualizer-merge-sort"
          element={
            isAuthenticated ? <MergeSortVisualizer /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/visualizer-dfs"
          element={
            isAuthenticated ? <DFSVisualizer /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/visualizer-bfs"
          element={
            isAuthenticated ? <BFSVisualizer /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/visualizer-stack"
          element={
            isAuthenticated ? <StackVisualizer /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/visualizer-queue"
          element={
            isAuthenticated ? <QueueVisualizer /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/visualizer-maxheap"
          element={
            isAuthenticated ? <MaxHeapVisualizer /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/visualizer-minheap"
          element={
            isAuthenticated ? <MinHeapVisualizer /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/visualizer-djikstra"
          element={
            isAuthenticated ? <DijkstraVisualizer /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/visualizer-flood-fill"
          element={
            isAuthenticated ? <FloodFillVisualizer /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/visualizer-singly-linked-list"
          element={
            isAuthenticated ? (
              <SinglyLinkedListVisualizer />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/visualizer-doubly-linked-list"
          element={
            isAuthenticated ? (
              <DoublyLinkedListVisualizer />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/visualizer-preorder"
          element={
            isAuthenticated ? <PreorderTraversal /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/visualizer-inorder"
          element={
            isAuthenticated ? <InorderTraversal /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/visualizer-postorder"
          element={
            isAuthenticated ? <PostorderTraversal /> : <Navigate to="/login" />
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            isAuthenticated && user?.role === 'admin' ? (
              <AdminPanel />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/create-problem"
          element={
            isAuthenticated && user?.role === 'admin' ? (
              <CreateProblem />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/update-problem"
          element={
            isAuthenticated && user?.role === 'admin' ? (
              <ProblemListForUpdate mode="update" />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/delete-problem"
          element={
            isAuthenticated && user?.role === 'admin' ? (
              <ProblemListForUpdate mode="delete" />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/update-problem/:id"
          element={
            isAuthenticated && user?.role === 'admin' ? (
              <UpdateProblem />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/delete-problem/:id"
          element={
            isAuthenticated && user?.role === 'admin' ? (
              <DeleteProblem />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/chat"
          element={isAuthenticated ? <ChatWithAI /> : <Navigate to="/login" />}
        />
        <Route
          path="/editorial/:id"
          element={isAuthenticated ? <Editorial /> : <Navigate to="/login" />}
        />
      </Routes>
    </AnimatePresence>
  )
}

export default AnimatedRoutes
