import logo from "assets/Parmar logo without bg.png";

export const HeaderLogo = () => {
  return (
    <div className="items-center box-border caret-transparent flex outline-[3px] no-underline">
      <a
        href="/"
        className="box-border caret-transparent block outline-[3px] no-underline cursor-pointer transition-opacity duration-200 hover:opacity-80"
        aria-label="Go to home page"
      >
        <img
          src={logo}
          alt="Parmar Properties Logo"
          className="box-border caret-transparent inline outline-[3px] no-underline h-[104px] md:h-[72px] w-auto object-contain object-left scale-[1.6] md:scale-[2.2] origin-left"
        />
      </a>
    </div>
  );
};
