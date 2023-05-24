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

interface TypographyProps {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const Typography = ({ variant, ...props }: JSX.HTMLAttributes<HTMLHeadingElement> & TypographyProps) => {
  props.class = `block ${commonStyles} ${textStyles[variant]} ${props.class ?? ""}`;

  switch (variant) {
    case "h1":
      return <h1 {...props} />;
    case "h2":
      return <h2 {...props} />;
    case "h3":
      return <h3 {...props} />;
    case "h4":
      return <h4 {...props} />;
    case "h5":
      return <h5 {...props} />;
    case "h6":
      return <h6 {...props} />;
    default:
      return <h1 {...props} />;
  }
};

export default Typography;
