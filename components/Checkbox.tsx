import { JSX } from "../deps.ts";

interface CheckboxProps {
  name: string;
  text: string;
  inputId: string;
}

export function Checkbox({ inputId, name, text }: JSX.HTMLAttributes<HTMLButtonElement> & CheckboxProps) {
  return (
    <div class="inline-flex items-center">
      <label for={inputId} class="relative flex cursor-pointer items-center rounded-full p-2">
        <input
          name={name}
          id={inputId}
          type="checkbox"
          class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-pink-500 checked:bg-pink-500 checked:before:bg-pink-500 hover:before:opacity-10"
        />
      </label>
      <label class="mt-px cursor-pointer select-none" for={inputId}>
        {text}
      </label>
    </div>
  );
}
