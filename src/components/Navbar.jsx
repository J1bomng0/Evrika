import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link';
import { db } from '../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import './Navbar.css'

const Navbar = () => {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [mobileOpen, setMobileOpen] = useState(false) // mobile toggle
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim() === "") {
        setSuggestions([])
        return
      }

      const q = query(
        collection(db, "notes"),
        where("title", ">=", query),
        where("title", "<=", query + "\uf8ff")
      )

      const querySnapshot = await getDocs(q)
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, title: doc.data().title }))
      setSuggestions(results)
    }

    fetchSuggestions()
  }, [query])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (query.trim() !== "") {
      const match = suggestions[0]
      if (match) {
        navigate(`/infos/${match.id}`)
      }
    }
  }

  const handleSuggestionClick = (id) => {
    navigate(`/infos/${id}`)
    setQuery("")
    setSuggestions([])
    setMobileOpen(false)
  }

  return (
    <header className="header">
      <div className="logo-container">
        <img src={`${import.meta.env.BASE_URL}images/logo-removebg-preview.png`} alt="logo" className="logo-img" />
        <Link to="/" className="logo-text">ევრიკა</Link>
      </div>

      {/* Hamburger button for mobile */}
      <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
        ☰
      </button>

      <div className={`nav-right ${mobileOpen ? 'open' : ''}`}>
        <form onSubmit={handleSearchSubmit} className='search-bar'>
          <input
            type="text"
            placeholder='ძებნა...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((s) => (
              <li key={s.id} onClick={() => handleSuggestionClick(s.id)}>
                {s.title}
              </li>
            ))}
          </ul>
        )}

        <nav className='navbar'>
          <HashLink smooth to="/#istoria">საკითხები</HashLink>
          <Link to="/studypath">სწავლა</Link>
          <a href="https://www.youtube.com/watch?v=65pky2hQ5wc">მწყურია</a>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
