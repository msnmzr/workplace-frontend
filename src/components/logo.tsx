import darkLogo from "@/assets/logos/dark.svg";
import Image from "next/image";

export function Logo() {
  return (
    <div className="relative max-w-[10.847rem]">
      <Image
        src="/images/logo/LCS-Main-Logo-300x128.png"
        width={300}
        height={128}
        className="dark:hidden"
        alt="Hum Leopards logo"
        role="presentation"
        quality={100}
        priority
      />

      <Image
        src="/images/logo/LCS-Main-Logo-300x128-white.png"
        width={300}
        height={128}
        className="hidden dark:block"
        alt="Hum Leopards logo"
        role="presentation"
        quality={100}
        priority
      />
    </div>
  );
}
