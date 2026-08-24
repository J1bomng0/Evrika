import React from "react";
import { Link } from "react-router-dom";
import "./Category.css";

const categories = [
  { id: 1, name: "მასწავლებელი", image: "images/iraebi.jpg", slug: "ira" },
  { id: 2, name: "კონსპექტები", image: "images/konspekt.jpg", slug: "konspektebi" },
  { id: 3, name: "კითხვა-პასუხი", image: "images/kitxva_pasux.jpeg", slug: "pasuxi" },
  { id: 4, name: "ტესტები", image: "images/testebi.jpg", slug: "testebi" },
  { id: 5, name: "რუკები", image: "images/rukebi.jpeg", slug: "rukebi" },
  { id: 6, name: "ქრონოლოგია", image: "images/kronolog.jpeg", slug: "kronologia" },
  { id: 7, name: "ზავები, ედიქტები...", image: "images/zavebi.jpeg", slug: "zavebi" },
  { id: 8, name: "ბრძოლები, აჯანყებები", image: "images/brdzolebi.jpeg", slug: "brdzolebi_ajankebebi" },
  { id: 9, name: "მსოფლიო ისტორიის მნიშვნელოვანი მოვლენები", image: "images/movlenebi.jpeg", slug: "movlenebi" },
  { id: 10, name: "ილუსტრაციები", image: "images/ilustraciebi.jpeg", slug: "ilustraciebi" },
  { id: 11, name: "რა არის ისტორია?", image: "images/raarisist.jpeg", slug: "istoria" },
];

const Category = () => {
  return (
    <div className="container" id="istoria">
      <h1>საკითხები</h1>

      <div className="card_container">
        {categories.map((cat) => {
          let path = `/category/${cat.slug}`;

          if (cat.slug === "istoria") {
            path = "/ra_aris_istoria";
          }

          if (cat.slug === "ira") {
            path = "/ira";
          }

          return (
            <Link
              key={cat.id}
              to={path}
              className="card"
            >
              <article className="card_article">
                <img
                  src={`${import.meta.env.BASE_URL}${cat.image}`}
                  alt={cat.name}
                  className="card_img"
                />
              </article>
              <h2 className="card_title">{cat.name}</h2>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Category;
