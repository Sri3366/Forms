// Minimal QR via public goqr API to avoid extra deps
export default function QRCodeBlock({ value, size = 220 }) {
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;

  return <img src={url} width={size} height={size} alt="UPI QR Code" data-testid="upi-qr-image" />;
}