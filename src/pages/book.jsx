import React from 'react'
import bannerImage from "../assets/book_cover.png";
import "./Book.css";

const Book = () => {
  return (
    <div style={{backgroundColor: '#D9CFCB'}}>
        <h1 className="info-title">წიგნი</h1>
        <div className="banner" >
            <img src={bannerImage} alt="bookCover"/>
        </div>
        <div className="info-container">
            <p className="info-text"> ისტორია არის დროის სარკე, სადაც ასახულია კაცობრიობის გზა, მისი ბრძოლები, წარმატებები და შეცდომები. იგი არ არის მხოლოდ წარსულის მოთხრობა, არამედ გამოცდილება, რომელსაც მომავალს გადავცემთ. <br/><br/>
                ჰეროდოტე, „ისტორიის მამა“, ამბობდა: „ისტორია იმისთვის იწერება, რომ ადამიანთა საქმენი არ დაიკარგოს.“ ამ სიტყვებშია ისტორიის ნამდვილი არსი – წარსულის შესწავლა არა მარტო ცოდნისთვის, არამედ იმისთვისაც, რომ მომავალი თაობები არ 
                დარჩნენ უსაფუძვლოდ, რომ მათ იცოდნენ, საიდან მოდიან და საით მიდიან.<br/><br/> ისტორია არ არის მხოლოდ მოვლენათა აღწერა. 
            </p>
        </div>
    </div>
  )
}

export default Book