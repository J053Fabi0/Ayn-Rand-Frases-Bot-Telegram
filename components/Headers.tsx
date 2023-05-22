import { JSX } from "../deps.ts";

const commonStyles = "font-sans font-semibold tracking-normal text-inherit antialiased";

const textStyles = {
  h1: "text-5xl leading-tight",
  h2: "text-4xl leading-[1.3]",
  h3: "text-3xl leading-snug",
  h4: "text-2xl leading-snug",
  h5: "text-xl leading-snug",
  h6: "text-base leading-relaxed capitalize",
};

const Header = ({ size, ...props }: JSX.HTMLAttributes<HTMLHeadingElement> & { size: 1 | 2 | 3 | 4 | 5 | 6 }) => {
  props.class = `block ${commonStyles} ${textStyles[`h${size}`]} ${props.class ?? ""}`;
  switch (size) {
    case 1:
      return <h1 {...props} />;
    case 2:
      return <h2 {...props} />;
    case 3:
      return <h3 {...props} />;
    case 4:
      return <h4 {...props} />;
    case 5:
      return <h5 {...props} />;
    case 6:
      return <h6 {...props} />;
    default:
      return <h1 {...props} />;
  }
};

export default Header;
