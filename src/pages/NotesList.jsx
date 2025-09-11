import React from 'react'
import { useParams } from 'react-router-dom';
import Notes from '../components/Notes';
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx';

const NotesList = () => {
  const { slug } = useParams();
  
  return (
    <div style={{backgroundColor: '#D9CFCB'}}>
      <Notes slug={slug} />
      <Footer />
    </div>
  )
}

export default NotesList