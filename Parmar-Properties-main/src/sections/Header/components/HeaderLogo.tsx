import logo from "assets/Parmar logo without bg.webp";

export const HeaderLogo = () => {
  return (
    <div className="flex items-center h-full">
      <a
        href="/"
        className="flex items-center transition-opacity duration-200 hover:opacity-80"
        aria-label="Go to home page"
      >
        <img
          src={logo}
          alt="Parmar Properties Logo"
          className="h-[64px] md:h-[72px] w-auto object-contain object-left scale-[1.76] md:scale-[2.42] origin-left pointer-events-none"
        />
      </a>
    </div>
  );
};
