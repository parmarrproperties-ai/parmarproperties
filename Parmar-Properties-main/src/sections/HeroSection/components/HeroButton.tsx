export type HeroButtonProps = {
  href?: string;
  label?: string;
};

export const HeroButton = ({ href = "/search", label = "Find Properties" }: HeroButtonProps) => {
  return (
    <a
      href={href}
      className="items-center bg-white box-border caret-transparent text-neutral-900 inline-flex text-base font-medium leading-6 outline-[3px] relative no-underline border px-6 py-3.5 rounded-[100px] border-transparent md:text-xs md:leading-[16.8px] md:px-5 md:py-[10.2667px]"
    >
      <span className="box-border caret-transparent block text-base leading-6 outline-[3px] relative no-underline md:text-xs md:leading-[16.8px]">
        {label}
      </span>
    </a>
  );
};
