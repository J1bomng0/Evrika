import React from 'react'
import './Footer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'        
import { faFacebookF } from '@fortawesome/free-brands-svg-icons'


const Footer = () => {
  return (
    <div className='footer'>
        <div className="row">
            <div className="col">
                <p className='footer-text'>Either i will find a way or i will make one - Hannibal</p>
            </div>
            <div className="col">
                <h3>კონტაქტი</h3>
                <p><FontAwesomeIcon icon={faEnvelope}/> irakhinkiladze52@gmail.com</p>
                <p><FontAwesomeIcon icon={faPhone}/> +995 579 12 79 46</p>
                <p><FontAwesomeIcon icon={faPhone}/> +995 550 05 60 76</p>
            </div>
            <div className="col">
                <div className="social-icons">
                    <a href="https://www.facebook.com/feverhsng" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faFacebookF} className='icon'/></a>
                    <a href="https://www.instagram.com/feverhsng?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faInstagram} className='icon'/></a>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Footer