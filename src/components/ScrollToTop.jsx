import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const mainContainer = document.getElementById("main-scroll");
    if (mainContainer) {
      mainContainer.scrollTop = 0; // scroll inner div instantly
    } else {
      window.scrollTo(0, 0); // fallback
    }
  }, [pathname]);

  return null;
}
