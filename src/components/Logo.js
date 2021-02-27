import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/logo.png"
      alt="Logo"
      layout="responsive"
      width={2197}
      height={1662}
    />
  );
}
