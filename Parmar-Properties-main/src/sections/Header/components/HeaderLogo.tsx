import logo from "assets/Parmar new  (1).png";

export const HeaderLogo = () => {
  return (
    <div className="flex items-center py-[5px]">
      <a
        href="/"
        className="flex items-center transition-opacity duration-200 hover:opacity-80"
        aria-label="Go to home page"
      >
        <img
          src={logo}
          alt="Parmar Properties Logo"
          className="h-[54px] md:h-[68px] md:ml-[80px] w-auto object-contain object-left pointer-events-none"
        />
      </a>
    </div>
  );
};