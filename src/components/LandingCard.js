function LandingCard({ src, alt, w, h, className }) {
  return (
    <div
      style={{ width: `${w}px`, height: `${h}px` }}
      className={`rounded-2xl overflow-hidden shadow-lg border border-neutral-200 bg-white ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
export default LandingCard;
