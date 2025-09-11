import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import './Navbar.css'

const Navbar = () => {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim() === "") {
        setSuggestions([])
        return
      }

      // Firestore query: assuming your collection is called "notes" and has "title" field
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
      // redirect to Infos page with the note ID if you want
      const match = suggestions[0] // take the first match by default
      if (match) {
        navigate(`/infos/${match.id}`)
      }
    }
  }

  const handleSuggestionClick = (id) => {
    navigate(`/infos/${id}`)
    setQuery("") // clear input
    setSuggestions([])
  }

  return (
    <header className="header">
      <div className="logo-container">
        <img src="../images/logo-removebg-preview.png" alt="logo" className="logo-img" />
        <a href="/" className="logo-text">ევრიკა</a>
      </div>

      <div className="nav-right">
        <form onSubmit={handleSearchSubmit} className='search-bar'>
          <input
            type="text"
            placeholder='ძებნა...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        {/* Suggestions dropdown */}
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
          <a href="#istoria">საკითხები</a>
          <a href="/studypath">სწავლა</a>
          <a href="https://www.youtube.com/watch?v=65pky2hQ5wc">მწყურია</a>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
