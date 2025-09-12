import type { SVGProps } from "react";

export function BhumicareLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={props.width || "1em"}
      height={props.height || "1em"}
      {...props}
    >
      <path
        fill="currentColor"
        d="M228 80v96a12 12 0 0 1-12 12H40a12 12 0 0 1-12-12V80a12 12 0 0 1 12-12h176a12 12 0 0 1 12 12Zm-12 4a4 4 0 0 0-4-4H44a4 4 0 0 0-4 4v88a4 4 0 0 0 4 4h168a4 4 0 0 0 4-4ZM180 128a12 12 0 0 0-12-12h-40a12 12 0 0 0 0 24h40a12 12 0 0 0 12-12Z"
      />
      <path
        fill="currentColor"
        d="M208 40a8 8 0 0 0-8 8v8h-32v-8a8 8 0 0 0-16 0v8h-48v-8a8 8 0 0 0-16 0v8H56v-8a8 8 0 0 0-16 0v8a28 28 0 0 0-12 2.62V48a8 8 0 0 0-16 0v160a8 8 0 0 0 16 0v-9.38A28.14 28.14 0 0 0 40 204h176a28.14 28.14 0 0 0 27.92-25.38V48a8 8 0 0 0-8-8ZM40 192a16 16 0 0 1 0-32h176a16 16 0 0 1 0 32Z"
      />
    </svg>
  );
}

export const Icons = {
  logo: BhumicareLogo,
};
