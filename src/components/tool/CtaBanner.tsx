interface CtaBannerProps {
  title: string;
  button: string;
  image?: string;
  video?: string;
  onClick?: () => void;
}

export function CtaBanner({ title, button, image, video, onClick }: CtaBannerProps) {
  return (
    <section className="w-full py-16">
      <div className="max-w-[1360px] mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden min-h-[420px] flex items-center justify-center">
          {video ? (
            <video
              src={video}
              poster={image}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : image ? (
            <img
              src={image}
              alt=""
              loading="lazy"
              width={1360}
              height={420}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : null}

          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/45 to-black/70" />

          <div className="relative z-10 text-center px-6">
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight whitespace-pre-line">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClick}
              className="mt-8 h-12 px-8 rounded-full bg-white text-black font-semibold hover:opacity-90 transition-opacity"
            >
              {button}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaBanner;
