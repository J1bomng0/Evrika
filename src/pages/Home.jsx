import React from 'react'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import Category from '../components/Category.jsx'
import Footer from '../components/Footer.jsx'

const Home = () => {
  return (
    <div style={{backgroundColor: '#D9CFCB'}}>
      <Hero />
      <Category />
      <Footer />
    </div>
    
  )
}

export default Home