import Image from 'next/image';

interface FeedCardImageGridProps {
  images: string[];
}

const imageSizes = '(max-width: 640px) calc(100vw - 40px), 585px';

export function FeedCardImageGrid({ images }: FeedCardImageGridProps) {
  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="overflow-hidden rounded-xl">
        <Image
          src={images[0]}
          alt=""
          width={800}
          height={600}
          sizes={imageSizes}
          className="w-full max-h-[520px] object-cover"
        />
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="grid aspect-[2/1] grid-cols-2 gap-1.5 overflow-hidden rounded-xl">
        {images.map((src, i) => (
          <div key={`${src}-${i}`} className="relative h-full w-full">
            <Image src={src} alt="" fill sizes={imageSizes} className="object-cover" />
          </div>
        ))}
      </div>
    );
  }

  const overflowCount = images.length - 3;

  return (
    <div className="grid aspect-[3/2] grid-cols-2 grid-rows-2 gap-1.5 overflow-hidden rounded-xl">
      <div className="relative row-span-2 h-full w-full">
        <Image src={images[0]} alt="" fill sizes={imageSizes} className="object-cover" />
      </div>
      {images.slice(1, 3).map((src, i) => (
        <div key={`${src}-${i}`} className="relative h-full w-full overflow-hidden">
          <Image src={src} alt="" fill sizes={imageSizes} className="object-cover" />
          {i === 1 && overflowCount > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-t04-b text-white">
              +{overflowCount}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
