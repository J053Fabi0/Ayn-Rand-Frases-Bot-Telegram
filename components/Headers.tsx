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

export const H1 = (props: JSX.HTMLAttributes<HTMLHeadingElement>) => (
  <h1 {...props} class={`block ${commonStyles} ${textStyles.h1} ${props.class ?? ""}`} />
);

export const H2 = (props: JSX.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 {...props} class={`block ${commonStyles} ${textStyles.h2} ${props.class ?? ""}`} />
);

export const H3 = (props: JSX.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 {...props} class={`block ${commonStyles} ${textStyles.h3} ${props.class ?? ""}`} />
);

export const H4 = (props: JSX.HTMLAttributes<HTMLHeadingElement>) => (
  <h4 {...props} class={`block ${commonStyles} ${textStyles.h4} ${props.class ?? ""}`} />
);

export const H5 = (props: JSX.HTMLAttributes<HTMLHeadingElement>) => (
  <h5 {...props} class={`block ${commonStyles} ${textStyles.h5} ${props.class ?? ""}`} />
);

export const H6 = (props: JSX.HTMLAttributes<HTMLHeadingElement>) => (
  <h6 {...props} class={`block ${commonStyles} ${textStyles.h6} ${props.class ?? ""}`} />
);

export const Header = ({
  size,
  ...props
}: JSX.HTMLAttributes<HTMLHeadingElement> & { size: 1 | 2 | 3 | 4 | 5 | 6 }) => {
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