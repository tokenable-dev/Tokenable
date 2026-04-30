import Image from "next/image";

type StarBulletProps = {
  className?: string;
  size?: number;
};

export function StarBullet({ className = "", size = 18 }: StarBulletProps) {
  return (
    <Image
      src="/star.png"
      alt=""
      width={size}
      height={size}
      className={`shrink-0 object-contain ${className}`}
      aria-hidden
    />
  );
}
