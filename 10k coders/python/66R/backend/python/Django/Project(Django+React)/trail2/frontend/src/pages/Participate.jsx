import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { toast } from "sonner";
import { Check, Upload, QrCode, Copy } from "lucide-react";
import QRCodeBlock from "../components/QRCodeBlock";

export default function Participate() {
  const nav = useNavigate();
  const [products, setProducts] = useState([]);
  const [upi, setUpi] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
    upi_reference: "",
  });

  useEffect(() => {
    api.get("/products").then((r) => setProducts(r.data));
    api.get("/upi-info").then((r) => setUpi(r.data));
  }, []);

  const onFile = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      toast.error("Screenshot must be under 4MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setScreenshot(reader.result);
    reader.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!selectedProduct) return toast.error("Please select a product");
    if (!screenshot) return toast.error("Upload payment screenshot");

    if (!form.full_name || !form.phone || !form.email || !form.address) {
      return toast.error("All fields are required");
    }

    setSubmitting(true);

    try {
      const { data } = await api.post("/submissions", {
        ...form,
        email: form.email.toLowerCase().trim(),
        payment_screenshot: screenshot,
        selected_product_id: selectedProduct.id,
      });

      toast.success("Ticket submitted! Awaiting verification.");
      nav(`/status?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const copyUPI = () => {
    if (!upi) return;

    navigator.clipboard.writeText(upi.upi_id);
    toast.success("UPI ID copied");
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 lg:px-24">
      <div className="mb-4 text-xs uppercase tracking-[0.3em] text-[#d4af37]">Step 01 → 03</div>

      <h1
        className="mb-3 font-serif text-4xl tracking-tight lg:text-6xl"
        data-testid="participate-title"
      >
        Enter the draw.
      </h1>

      <p className="max-w-2xl text-white/55">
        Pay ₹150 via UPI, choose your guaranteed gift, then submit your ticket. Verification is
        manual to ensure fairness.
      </p>

      <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Payment column */}
        <div className="lg:col-span-5">
          <div className="glass sticky top-24 rounded-2xl p-8">
            <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4af37]">
              <QrCode className="h-4 w-4" /> UPI Payment
            </div>

            <div
              className="mb-6 flex items-center justify-center rounded-xl bg-white p-4"
              data-testid="qr-block"
            >
              {upi ? (
                <QRCodeBlock value={upi.qr_url} size={220} />
              ) : (
                <div className="h-[220px] w-[220px] animate-pulse rounded bg-black/10" />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-black/40 p-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                    UPI ID
                  </div>
                  <div className="mt-0.5 font-mono text-[#f2e3c6]" data-testid="upi-id-display">
                    {upi?.upi_id || "—"}
                  </div>
                </div>

                <button
                  onClick={copyUPI}
                  className="rounded-md p-2 transition-colors hover:bg-white/5"
                  data-testid="copy-upi-btn"
                >
                  <Copy className="h-4 w-4 text-white/60" />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-black/40 p-3">
                <span className="text-xs uppercase tracking-[0.25em] text-white/40">Amount</span>
                <span className="font-serif text-2xl text-[#d4af37]">₹{upi?.amount ?? 150}</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-black/40 p-3">
                <span className="text-xs uppercase tracking-[0.25em] text-white/40">Payee</span>
                <span className="text-sm text-white/80">{upi?.payee_name || "—"}</span>
              </div>
            </div>

            <p className="mt-6 text-xs leading-relaxed text-white/40">
              Scan the QR with any UPI app. After payment, screenshot the success screen — you’ll
              upload it next.
            </p>
          </div>
        </div>

        {/* Form column */}
        <form onSubmit={submit} className="space-y-10 lg:col-span-7">
          {/* Products */}
          <div>
            <h2 className="mb-2 font-serif text-3xl">Choose your guaranteed gift</h2>
            <p className="mb-6 text-sm text-white/45">Worth ₹150. Yours whether you win or not.</p>

            <div className="grid max-h-[520px] grid-cols-2 gap-4 overflow-y-auto pr-2 sm:grid-cols-3">
              {products.map((p) => {
                const sel = selectedProduct?.id === p.id;

                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    data-testid={`product-${p.id}`}
                    className={`relative overflow-hidden rounded-xl border text-left transition-all duration-300 ${
                      sel
                        ? "border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="aspect-square overflow-hidden bg-black/40">
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                    </div>

                    <div className="p-3">
                      <div className="text-sm leading-tight">{p.name}</div>
                      <div className="mt-1 text-xs text-[#d4af37]">₹{p.price}</div>
                    </div>

                    {sel && (
                      <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#d4af37]">
                        <Check className="h-3.5 w-3.5 text-black" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personal details */}
          <div>
            <h2 className="mb-6 font-serif text-3xl">Your details</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                placeholder="Full Name"
                className="input-dark rounded-lg px-4 py-3"
                data-testid="input-name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required
              />

              <input
                placeholder="Phone Number"
                className="input-dark rounded-lg px-4 py-3"
                data-testid="input-phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />

              <input
                placeholder="Email"
                type="email"
                className="input-dark rounded-lg px-4 py-3 md:col-span-2"
                data-testid="input-email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />

              <textarea
                placeholder="Shipping Address"
                rows={3}
                className="input-dark resize-none rounded-lg px-4 py-3 md:col-span-2"
                data-testid="input-address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
              />

              <input
                placeholder="UPI Reference / Txn ID (optional)"
                className="input-dark rounded-lg px-4 py-3 md:col-span-2"
                data-testid="input-upi-ref"
                value={form.upi_reference}
                onChange={(e) => setForm({ ...form, upi_reference: e.target.value })}
              />
            </div>
          </div>

          {/* Screenshot */}
          <div>
            <h2 className="mb-6 font-serif text-3xl">Payment screenshot</h2>

            <label
              className="block cursor-pointer rounded-xl border-2 border-dashed border-white/15 p-8 text-center transition-colors hover:border-[#d4af37]/60"
              data-testid="screenshot-dropzone"
            >
              <input
                type="file"
                accept="image/*"
                onChange={onFile}
                className="hidden"
                data-testid="input-screenshot"
              />

              {screenshot ? (
                <img src={screenshot} alt="Payment proof" className="mx-auto max-h-64 rounded-lg" />
              ) : (
                <div>
                  <Upload className="mx-auto mb-3 h-8 w-8 text-white/40" />
                  <div className="text-white/60">Click to upload screenshot</div>
                  <div className="mt-1 text-xs text-white/30">PNG / JPG, up to 4MB</div>
                </div>
              )}
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            data-testid="submit-ticket-btn"
            className="btn-gold w-full rounded-full py-5 text-base font-medium tracking-wide"
          >
            {submitting ? "Submitting…" : "Submit Ticket for Verification →"}
          </button>
        </form>
      </div>
    </div>
  );
}