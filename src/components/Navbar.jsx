import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { db } from '../firebase';
import { collection, query as firestoreQuery, where, getDocs } from 'firebase/firestore';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim() === '') {
        setSuggestions([]);
        return;
      }

      try {
        console.log('Searching for:', searchQuery);
        const notesRef = collection(db, 'notes');
        const q = firestoreQuery(
          notesRef,
          where('title', '>=', searchQuery.toLowerCase()),
          where('title', '<=', searchQuery.toLowerCase() + '\uf8ff')
        );
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          category: doc.data().category, // Assuming category field exists
        }));
        console.log('Suggestions:', results);
        setSuggestions(results);
      } catch (error) {
        console.error('Firestore error:', error);
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '' && suggestions.length > 0) {
      const match = suggestions[0];
      navigate(`/category/${match.category}/${match.id}`);
      setSearchQuery('');
      setSuggestions([]);
      setMobileOpen(false);
    }
  };

  const handleSuggestionClick = (id, category) => {
    navigate(`/category/${category}/${id}`);
    setSearchQuery('');
    setSuggestions([]);
    setMobileOpen(false);
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img
          src={`${import.meta.env.BASE_URL}images/logo-removebg-preview.png`}
          alt="logo"
          className="logo-img"
        />
        <Link to="/" className="logo-text">
          ევრიკა
        </Link>
      </div>

      <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
        ☰
      </button>

      <div className={`nav-right ${mobileOpen ? 'open' : ''}`}>
        <form onSubmit={handleSearchSubmit} className="search-bar">
          <input
            type="text"
            placeholder="ძებნა..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
          />
        </form>

        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((s) => (
              <li key={s.id} onClick={() => handleSuggestionClick(s.id, s.category)}>
                {s.title}
              </li>
            ))}
          </ul>
        )}

        <nav className="navbar">
          <HashLink smooth to="/#istoria">
            საკითხები
          </HashLink>
          <Link to="/studypath">სწავლა</Link>
          <a href="https://www.youtube.com/watch?v=65pky2hQ5wc">მწყურია</a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;