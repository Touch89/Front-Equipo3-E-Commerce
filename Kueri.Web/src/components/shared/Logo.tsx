import { Link } from "react-router"

export const Logo = () => {
  return (
    <Link to='/' className="text-2x1 font-bold trackinng-tighter transition-all">
      <>
        <p className="hidden lg:block">
          Kueri
          <span className="text-cyan-600">Mex</span>
        </p>

        <p className="flex text-4xl lg:hidden">
          <span className="-skew-x-6">K</span>
          <span className="text-cyan-600 skew-x-6">M</span>
        </p>
      </>
    </Link>
  );
}