import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { Search, Clock, CheckCircle2, XCircle } from "lucide-react";

const statusMap = {
  pending: { color: "#f59e0b", icon: Clock, label: "Pending Verification" },
  approved: { color: "#22c55e", icon: CheckCircle2, label: "Approved" },
  rejected: { color: "#ef4444", icon: XCircle, label: "Rejected" },
};

export default function Status() {
  const [params, setParams] = useSearchParams();
  const [email, setEmail] = useState(params.get("email") || "");
  const [tickets, setTickets] = useState(null);
  const [loading, setLoading] = useState(false);

  const search = async (e) => {
    e?.preventDefault();

    if (!email) return;

    setLoading(true);
    setParams({ email });

    try {
      const { data } = await api.get("/submissions/lookup", { params: { email } });
      setTickets(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.get("email")) search();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:px-12">
      <div className="mb-3 text-xs uppercase tracking-[0.3em] text-[#d4af37]">Track</div>

      <h1 className="mb-8 font-serif text-4xl lg:text-5xl" data-testid="status-title">
        My tickets
      </h1>

      <form onSubmit={search} className="mb-12 flex max-w-xl gap-3">
        <input
          placeholder="Enter your email"
          type="email"
          className="input-dark flex-1 rounded-lg px-4 py-3"
          data-testid="status-email-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          className="btn-gold inline-flex items-center gap-2 rounded-lg px-6 py-3"
          data-testid="status-search-btn"
        >
          <Search className="h-4 w-4" /> Search
        </button>
      </form>

      {loading && <div className="text-white/40">Searching…</div>}

      {tickets && tickets.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center" data-testid="status-empty">
          <div className="text-white/60">No tickets found for this email.</div>
        </div>
      )}

      <div className="space-y-4">
        {tickets?.map((t) => {
          const s = statusMap[t.status] || statusMap.pending;
          const Icon = s.icon;

          return (
            <div key={t.id} className="glass rounded-2xl p-6 md:p-8" data-testid={`ticket-${t.id}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-white/40">Ticket</div>

                  <div className="mt-1 font-serif text-3xl">
                    {t.batch_number ? (
                      <>
                        Batch <span className="text-[#d4af37]">{t.batch_number}</span> · #
                        <span className="text-[#d4af37]">{t.ticket_number}</span>
                      </>
                    ) : (
                      <span className="text-white/60">Awaiting batch assignment</span>
                    )}
                  </div>

                  <div className="mt-2 text-sm text-white/45">
                    Gift: <span className="text-white/80">{t.selected_product_name}</span>
                  </div>
                </div>

                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                  style={{
                    background: `${s.color}20`,
                    color: s.color,
                    border: `1px solid ${s.color}40`,
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {s.label}
                </div>
              </div>

              {t.status === "rejected" && t.rejection_reason && (
                <div className="mt-4 border-l-2 border-red-500/40 pl-4 text-sm text-red-300/80">
                  {t.rejection_reason}
                </div>
              )}

              <div className="mt-4 font-mono text-xs text-white/30">
                Submitted {new Date(t.created_at).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

