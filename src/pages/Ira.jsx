import React from "react";
import "./Ira.css";
import helmetImg from "../assets/helmet.png";

export default function Ira() {
  return (
    <div className="about-contact-page">
      {/* ----------------- Profile Section ----------------- */}
      <section className="profile-section">
        <p className="profile-tagline">მოვამზადებ აბიტურიენტებს ისტორიაში</p>
        <h1 className="profile-name">ირა ხინკილაძე</h1>

        <div className="profile-badge">
          <span className="sparkle">✧+˚.</span>
          <span className="badge-text">გამოცდილება</span>
          <span className="sparkle">.˚+✧</span>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <p className="detail-bold">უფროსი მასწავლებელი ისტორიაში</p>
          </div>

          <div className="detail-item">
            <p>
              <strong>ბათუმის შოთა რუსთაველის სახელმწიფო უნივერსიტეტი:</strong>{" "}
              ბაკალავრის ხარისხი ჰუმანიტარულ ისტორიაში
            </p>
          </div>

          <div className="detail-item">
            <p>
              <strong>სპეცმასწავლებელი:</strong> ინდივიდუალური გაკვეთილები
            </p>
          </div>

          <div className="detail-item">
            <p>
              <strong>მასწავლებელთა პროფესიული განვითარების ეროვნული ცენტრი:</strong>{" "}
              სერტიფიცირებული მასწავლებელი ისტორიაში
            </p>
          </div>
        </div>

        <div className="profile-image-wrapper">
          <img src={helmetImg} alt="Spartan Helmet" className="helmet-img" />
        </div>
      </section>

      {/* ----------------- Contact Section ----------------- */}
      <section className="contact-section">
        <h2 className="contact-title">საკონტაქტო დეტალები</h2>

        <div className="contact-grid">
          {/* Location */}
          <div className="contact-item">
            <svg className="contact-icon" viewBox="0 0 24 24" fill="#6c2d2d">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
            </svg>
            <div className="contact-info">
              <span className="contact-label">მდებარეობა</span>
              <span className="contact-value">ბათუმი</span>
            </div>
          </div>

          {/* Phone */}
          <div className="contact-item">
            <svg className="contact-icon" viewBox="0 0 24 24" fill="#6c2d2d">
              <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/>
            </svg>
            <div className="contact-info">
              <span className="contact-label">ნომერი</span>
              <a href="tel:+995579127946" className="contact-value link">
                +995 579 127 946
              </a>
            </div>
          </div>

          {/* Facebook */}
          <div className="contact-item">
            <svg className="contact-icon" viewBox="0 0 24 24" fill="#6c2d2d">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
            </svg>
            <div className="contact-info">
              <a
                href="https://www.facebook.com/feverhsng"
                target="_blank"
                rel="noreferrer"
                className="contact-label"
              >
                Facebook
              </a>
            </div>
          </div>

          {/* Instagram */}
          <div className="contact-item">
            <svg className="contact-icon" viewBox="0 0 24 24" fill="#6c2d2d">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <div className="contact-info">
              <a
                href="https://www.instagram.com/feverhsng?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noreferrer"
                className="contact-label"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}