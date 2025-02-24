import { Link } from "react-router-dom";

type LogoProps = {
  className?: string;
};

const Logo = ({ className } : LogoProps) => {
  return (
    <Link to={"/"}>
      <div className={`text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-900 drop-shadow-lg hover:text-key transition-all duration-200 ${className}`}>
        <span className="tracking-tight">TMDB2</span>
      </div>
    </Link>
  );
};

export default Logo;
