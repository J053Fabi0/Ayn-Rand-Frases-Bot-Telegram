import { JSX } from "../deps.ts";

const colors = {
  red: "bg-pink-500 shadow-pink-500/20 hover:shadow-pink-500/40",
  blue: "bg-blue-500 shadow-blue-500/20 hover:shadow-blue-500/40",
  green: "bg-green-500 shadow-green-500/20 hover:shadow-green-500/40",
  // orange: "bg-orange-500 shadow-orange-500/20 hover:shadow-orange-500/40",
};

interface ButtonProps {
  color?: keyof typeof colors;
}

export default function Button(props: JSX.HTMLAttributes<HTMLButtonElement> & ButtonProps) {
  const color = colors[props.color ?? "blue"];

  return (
    <button
      {...props}
      class={`
        middle none center rounded-lg py-3 px-6 font-sans text-xs font-bold uppercase text-white
        shadow-md transition-all hover:shadow-lg focus:opacity-[0.85] focus:shadow-none
        active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50
        disabled:shadow-none ${color} ${props.class ?? ""}`}
    >
      {props.children}
    </button>
  );
}
