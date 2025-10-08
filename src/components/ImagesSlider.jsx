import Slider from "react-slick";
import "./ImagesSlider.css";

const ImagesSlider = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      {images.map((url, index) => (
        <div key={index}>
          <img src={url} alt={`Slide ${index}`} className="slider-image" />
        </div>
      ))}
    </Slider>
  );
};
