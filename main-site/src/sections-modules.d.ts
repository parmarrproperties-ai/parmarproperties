// ── Asset type declarations ──────────────────────────────────────────────────
declare module "*.webp" {
  const src: string;
  export default src;
}
declare module "*.png" {
  const src: string;
  export default src;
}
declare module "*.jpg" {
  const src: string;
  export default src;
}
declare module "*.jpeg" {
  const src: string;
  export default src;
}
declare module "*.svg" {
  const src: string;
  export default src;
}

// ── Section module declarations ───────────────────────────────────────────────
declare module "@/sections/Header" {
  const Header: any;
  export { Header };
}

declare module "@/sections/Header/index" {
  const Header: any;
  export { Header };
}

declare module "@/sections/Main" {
  const Main: any;
  export { Main };
}

declare module "@/sections/Main/index" {
  const Main: any;
  export { Main };
}

declare module "@/sections/Footer" {
  const Footer: any;
  export { Footer };
}

declare module "@/sections/Footer/index" {
  const Footer: any;
  export { Footer };
}

declare module "@/sections/AgentsSection/components/AgentsMedia" {
  const AgentsMedia: any;
  export { AgentsMedia };
}

declare module "@/sections/AgentsSection/components/AgentsContent" {
  const AgentsContent: any;
  export { AgentsContent };
}

