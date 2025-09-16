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
        <path fill="none" d="M0 0h256v256H0z"/>
        <path fill="currentColor" d="M168 40H88a48 48 0 0 0-48 48v80a48 48 0 0 0 48 48h80a48 48 0 0 0 48-48V88a48 48 0 0 0-48-48Zm36 128a36 36 0 0 1-36 36H88a36 36 0 0 1-36-36V88a36 36 0 0 1 36-36h80a36 36 0 0 1 36 36Z"/>
        <path fill="currentColor" d="M160 88a12 12 0 0 0-12 12v11.42A40 40 0 0 0 128 96a40 40 0 0 0-29.46 13.06A12 12 0 0 0 108 128a12 12 0 0 0 12 12h11.42A40 40 0 0 0 128 160a40 40 0 0 0 32-16.54V156a12 12 0 0 0 24 0v-56a12 12 0 0 0-12-12Zm-16 56a28 28 0 0 1-27.75 28A28 28 0 0 1 88.2 143a12 12 0 0 0-21.6-15 40 40 0 0 0 45.15 50 40 40 0 0 0 39.71-36h-27.46Z"/>
    </svg>
  );
}

export const Icons = {
  logo: BhumicareLogo,
};
