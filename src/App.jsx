import React from "react";
import Home from './pages/Home.jsx';
import NotesList from './pages/NotesList.jsx';
import Infos from './pages/Infos.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import { Routes, Route } from "react-router-dom";
import StudyPath from './components/StudyPath.jsx';
import Navbar from './components/Navbar.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import RaarisIstoria from './pages/RaarisIstoria.jsx';

function App() {
  return (
    <>
    <Navbar />
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/studypath" element={<StudyPath />} />
      <Route path="/category/:slug" element={<NotesList />} />
      <Route path="/category/:slug/:noteId" element={<Infos />} />
      <Route path="/ra_aris_istoria" element={<RaarisIstoria />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={ <ProtectedRoute><Dashboard /></ProtectedRoute>}/>
    </Routes>
    </>
  );
}

export default App;
