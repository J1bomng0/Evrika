import React from "react";
import { Routes, Route, useParams } from "react-router-dom";

import Home from "./pages/Home.jsx";
import NotesList from "./pages/NotesList.jsx";
import Infos from "./pages/Infos.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import StudyPath from "./components/StudyPath.jsx";
import Navbar from "./components/Navbar.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import RaarisIstoria from "./pages/RaarisIstoria.jsx";
import Book from "./pages/book.jsx";
import Timeline from "./components/Timeline.jsx";

/* 🔹 Category-aware router */
const CategoryRouter = () => {
  const { slug } = useParams();

  if (slug === "kronologia") {
    return <Timeline />;
  }

  return <Infos />;
};

function App() {
  return (
    <>
      <Navbar />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/studypath" element={<StudyPath />} />

        {/* Category pages */}
        <Route path="/category/:slug" element={<NotesList />} />
        <Route
          path="/category/:slug/:noteId"
          element={<CategoryRouter />}
        />

        {/* Static pages */}
        <Route path="/ra_aris_istoria" element={<RaarisIstoria />} />
        <Route path="/book" element={<Book />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
