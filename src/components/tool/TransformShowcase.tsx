interface Props {
  heading: string;
  sub?: string;
  inputLabel?: string;
  outputLabel?: string;
  inputs: string[];
  outputs: string[];
  prompt?: string;
}

export function TransformShowcase({
  heading,
  sub,
  inputLabel = "Исходное изображение",
  outputLabel = "Выходное изображение",
  inputs,
  outputs,
  prompt,
}: Props) {
  const cardClass =
    "w-[200px] aspect-[3/4] rounded-xl overflow-hidden border border-white/10 shrink-0";

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-[32px] font-bold text-center">{heading}</h2>
      {sub && (
        <p className="mt-3 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
          {sub}
        </p>
      )}

      <div className="mt-10 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 justify-center">
        <div className="shrink-0">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
            {inputLabel}
          </div>
          {inputs.length > 1 ? (
            <div className="flex gap-3">
              {inputs.map((src, i) => (
                <div key={i} className={cardClass}>
                  <img
                    src={src}
                    alt={`${inputLabel} ${i + 1}`}
                    loading="lazy"
                    width={600}
                    height={800}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={cardClass}>
              <img
                src={inputs[0]}
                alt={inputLabel}
                loading="lazy"
                width={600}
                height={800}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div
          className="shrink-0 text-muted-foreground rotate-90 md:rotate-0 md:mt-6"
          style={{ fontSize: 24, lineHeight: 1 }}
          aria-hidden
        >
          →
        </div>

        <div className="shrink-0">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
            {outputLabel}
          </div>
          <div className="flex gap-3">
            {outputs.map((src, i) => (
              <div key={i} className={cardClass}>
                <img
                  src={src}
                  alt={`${outputLabel} ${i + 1}`}
                  loading="lazy"
                  width={600}
                  height={800}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {prompt && (
        <p className="mt-8 text-center text-sm italic text-muted-foreground max-w-2xl mx-auto">
          {prompt}
        </p>
      )}
    </section>
  );
}