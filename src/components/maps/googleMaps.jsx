export default function GoogleMaps({ address, className = "" }) {
  if (!address) return null;

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <div className={`w-full overflow-hidden border ${className}`}>
      <iframe
        title={`${address}`}
        src={mapSrc}
        width="100%"
        height="400px"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}