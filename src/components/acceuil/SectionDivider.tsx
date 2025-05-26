import Image from 'next/image';

export default function SectionDivider() {
  return (
    <div className="w-full relative overflow-hidden bg-white">
      <div className="w-full max-w-[2000px] mx-auto">
        <Image
          src="/sep.png"
          alt="Séparateur de section"
          width={1920}
          height={200}
          className="w-full h-auto object-cover"
          priority
        />
      </div>
    </div>
  );
}
