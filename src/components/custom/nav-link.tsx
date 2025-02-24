import { Link } from "react-router-dom";

type NavLinkProps = {
  to: string;
  label: string;
};

const CustomNavLink = ({ to, label }: NavLinkProps) => {
  return (
    <Link to={to}>
      <span className="font-semibold hover:text-key relative group pt-1 pb-1">
        {label}
        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-key transition-all duration-300 group-hover:w-full"></span>
      </span>
    </Link>
  );
};

export default CustomNavLink;
