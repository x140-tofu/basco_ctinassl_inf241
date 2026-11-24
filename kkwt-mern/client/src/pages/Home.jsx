import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home({ user, setUser, cartCount }) {
  return (
    <div className="home-wrapper">
      {/* Top-Left Dashed Spiral SVG */}
      <svg className="top-left-swirl" viewBox="0 0 180 180" fill="none">
        <path
          d="M 10 20 C 30 -10, 120 -10, 145 45 C 165 95, 125 150, 70 148 C 20 146, -5 100, 15 60 C 32 28, 75 20, 100 45 C 120 65, 108 102, 80 105 C 58 107, 45 88, 56 72"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="3"
          strokeDasharray="9 7"
          strokeLinecap="round"
        />
      </svg>

      <Navbar variant="plum" user={user} setUser={setUser} cartCount={cartCount} />

      <section className="home-hero-exact">
        {/* LEFT COLLAGE */}
        <div className="collage-stage">
          {/* Dashed Yarn Trail with Loop & Heart */}
          <svg className="yarn-trail-svg" viewBox="0 0 580 560" fill="none">
            <path
              d="M -10 300 C 65 355, 175 310, 185 360 C 195 405, 135 405, 152 355 C 168 305, 275 325, 345 355"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="2.5"
              strokeDasharray="7 6"
              strokeLinecap="round"
            />
            <path
              d="M 145 455 C 168 530, 245 540, 260 498 C 272 465, 228 450, 222 488 C 216 520, 275 530, 340 475"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="2.5"
              strokeDasharray="7 6"
              strokeLinecap="round"
            />
          </svg>

          {/* Beanie */}
          <div className="collage-item item-beanie">
            <img src="/images/home_beanie.png" alt="Crochet Beanie" />
          </div>

          {/* Accessories (Hair Clip) */}
          <div className="collage-item item-clip">
            <img src="/images/home_clip.png" alt="Crochet Hair Clip" />
          </div>

          {/* Flowers (Lavender) */}
          <div className="collage-item item-flowers">
            <img src="/images/home_flower.png" alt="Crochet Lavender" />
          </div>
        </div>

        {/* RIGHT HERO TEXT */}
        <div className="hero-text-block">
          <h1>
            Knot Knot,
            <br />
            Who’s There?
          </h1>
          <p>Discover the patterns that can unlock your love for crochet !</p>
          <div className="hero-cta-wrap">
            <Link to="/shop" className="pill-btn btn-white hero-learn-btn">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom-Right Pink Crochet Hook */}
        <img
        src="/images/hook.png"
        alt="Pink Crochet Hook"
        className="bottom-right-hook"
        />
    </div>
  );
}