import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/logo.png"
      alt="Logo"
      layout="responsive"
      width={501}
      height={380}
    />
  );
}
