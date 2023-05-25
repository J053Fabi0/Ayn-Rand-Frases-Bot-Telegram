import { JSX } from "../deps.ts";

const commonStyles = "block font-sans text-inherit antialiased";
const headersCommonStyles = "font-semibold tracking-normal leading-tight";

const textStyles = {
  h1: `${headersCommonStyles} text-5xl leading-tight`,
  h2: `${headersCommonStyles} text-4xl leading-[1.3]`,
  h3: `${headersCommonStyles} text-3xl leading-snug`,
  h4: `${headersCommonStyles} text-2xl leading-snug`,
  h5: `${headersCommonStyles} text-xl leading-snug`,
  h6: `${headersCommonStyles} text-base leading-relaxed capitalize`,

  p: "text-base font-light leading-relaxed",
  lead: "text-xl font-normal leading-relaxed",
  smallP: "text-sm font-light leading-normal",
};

interface TypographyProps {
  variant?: keyof typeof textStyles;
}

const Typography = ({ variant = "p", ...props }: JSX.HTMLAttributes<HTMLHeadingElement> & TypographyProps) => {
  props.class = `${commonStyles} ${textStyles[variant]} ${props.class ?? ""}`;

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

    case "p":
    case "lead":
    case "smallP":
    default:
      return <p {...props} />;
  }
};

export default Typography;
