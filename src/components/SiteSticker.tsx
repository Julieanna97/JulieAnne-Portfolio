import Image from "next/image";

export default function SiteSticker() {
  return (
    <div className="site-sticker">
      <Image
        src="/branding/ja-sticker.svg"
        alt="Julie Anne"
        fill
        priority
        sizes="72px"
      />
    </div>
  );
}