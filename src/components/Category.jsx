import React from 'react';
import { Link } from 'react-router-dom';
import './Category.css';

// ✅ Removed leading "/" from image paths
const categories = [
  { id: 1, name: "კონსპექტები", image: "images/konspekt.jpg", slug: "konspektebi" },
  { id: 2, name: "რუკები", image: "images/rukebi.jpeg", slug: "rukebi" },
  { id: 3, name: "ილუსტრაციები", image: "images/ilustraciebi.jpeg", slug: "ilustraciebi" },
  { id: 4, name: "ქრონოლოგია", image: "images/kronolog.jpeg", slug: "kronologia" },
  { id: 5, name: "ბრძოლები, აჯანყებები", image: "images/brdzolebi.jpeg", slug: "brdzolebi_ajankebebi" },
  { id: 6, name: "მსოფლიო ისტორიის მნიშვნელოვანი მოვლენები", image: "images/movlenebi.jpeg", slug: "movlenebi" },
  { id: 7, name: "კითხვა-პასუხი", image: "images/kitxva_pasux.jpeg", slug: "pasuxi" },
  { id: 8, name: "ზავები,ედიქტები...", image: "images/zavebi.jpeg", slug: "zavebi" },
  { id: 9, name: "დროშები", image: "images/droshebi.jpeg", slug: "tema9" },  
  { id: 10, name: "რა არის ისტორია? ", image: "images/raarisist.jpeg", slug: "istoria" },
];

const Category = () => {
  return (
    <div className="container" id="istoria">
      <h1>საკითხები</h1>
      <div className="card_container">
        {categories.map((cat) => (
          <Link to={`/category/${cat.slug}`} key={cat.id} className="card">
            <article className="card_article">
              {/* ✅ Use import.meta.env.BASE_URL to fix paths on GitHub Pages */}
              <img 
                src={`${import.meta.env.BASE_URL}${cat.image}`} 
                alt={cat.name} 
                className="card_img" 
              />
            </article>
            <h2 className="card_title">{cat.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Category;
