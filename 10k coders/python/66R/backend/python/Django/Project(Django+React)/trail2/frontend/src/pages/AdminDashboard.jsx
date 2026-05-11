import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setAdminToken, getAdminAuthConfig } from "../lib/api";
import { toast } from "sonner";
import { Check, X, LogOut, Dice5, RefreshCw, Eye } from "lucide-react";

const tabs = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "batches", label: "Batches" },
];

export default function AdminDashboard() {
  const nav = useNavigate();
  const [tab, setTab] = useState("pending");
  const [subs, setSubs] = useState([]);
  const [batches, setBatches] = useState([]);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(null);

  const fetchData = async () => {
    setBusy(true);

    try {
      if (tab === "batches") {
        const { data } = await api.get("/admin/batches",getAdminAuthConfig());
        setBatches(data);
      } else {
        const { data } = await api.get("/admin/submissions", { params: { status: tab }, ...getAdminAuthConfig(),});
        setSubs(data);
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        setAdminToken(null);
        nav("/admin/login");
      }
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    fetchData();
    /* eslint-disable-next-line */
  }, [tab]);

  const approve = async (id) => {
    try {
      await api.post(`/admin/submissions/${id}/approve`,{},getAdminAuthConfig());
      toast.success("Approved & ticket assigned");
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed");
    }
  };

  const reject = async (id) => {
    const reason = prompt("Rejection reason?", "Payment not verified");
    if (reason === null) return;

    try {
      await api.post(`/admin/submissions/${id}/reject`, { reason },getAdminAuthConfig());
      toast.success("Rejected");
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed");
    }
  };

  const draw = async (n) => {
    if (!window.confirm(`Draw winner for batch ${n}?`)) return;

    try {
      const { data } = await api.post(`/admin/batches/${n}/draw`,{},getAdminAuthConfig());
      toast.success(`Winner: ${data.winner_name} (Ticket #${data.winner_ticket_number})`);
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed");
    }
  };

  const logout = () => {
    setAdminToken(null);
    nav("/admin/login");
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Admin</div>
          <h1
            className="mt-1 font-serif text-4xl lg:text-5xl"
            data-testid="admin-dashboard-title"
          >
            Control room
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchData}
            className="btn-outline-gold inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm"
            data-testid="admin-refresh-btn"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>

          <button
            onClick={logout}
            className="btn-outline-gold inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm"
            data-testid="admin-logout-btn"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>

      <div className="mb-8 flex gap-2 border-b border-white/5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            data-testid={`admin-tab-${t.key}`}
            className={`border-b-2 px-4 py-3 text-sm tracking-wide transition-colors ${
              tab === t.key
                ? "border-[#d4af37] text-[#d4af37]"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {busy && <div className="mb-4 text-white/40">Loading…</div>}

      {tab !== "batches" ? (
        subs.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-[#12131a] p-12 text-center text-white/40">
            No {tab} submissions.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/5 bg-[#12131a]">
            <table className="w-full text-sm">
              <thead className="border-b border-white/5 text-left text-xs uppercase tracking-[0.2em] text-white/40">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Ticket</th>
                  <th className="p-4">Proof</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {subs.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-white/5 hover:bg-white/[0.02]"
                    data-testid={`admin-sub-${s.id}`}
                  >
                    <td className="p-4">
                      <div className="text-white">{s.full_name}</div>
                      <div className="text-xs text-white/40">
                        {new Date(s.created_at).toLocaleString()}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="text-white/80">{s.email}</div>
                      <div className="text-xs text-white/40">{s.phone}</div>
                    </td>

                    <td className="p-4 text-white/70">{s.selected_product_name}</td>

                    <td className="p-4">
                      {s.batch_number ? (
                        <span className="text-[#d4af37]">
                          B{s.batch_number} · #{s.ticket_number}
                        </span>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => setPreview(s)}
                        className="inline-flex items-center gap-1 text-xs text-[#d4af37] hover:underline"
                        data-testid={`view-screenshot-${s.id}`}
                      >
                        <Eye className="h-3 w-3" /> View
                      </button>
                    </td>

                    <td className="p-4 text-right">
                      {s.status === "pending" && (
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => approve(s.id)}
                            className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/25"
                            data-testid={`approve-${s.id}`}
                          >
                            <Check className="h-3 w-3" /> Approve
                          </button>

                          <button
                            onClick={() => reject(s.id)}
                            className="inline-flex items-center gap-1 rounded-md bg-red-500/15 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/25"
                            data-testid={`reject-${s.id}`}
                          >
                            <X className="h-3 w-3" /> Reject
                          </button>
                        </div>
                      )}

                      {s.status !== "pending" && (
                        <span className="text-xs text-white/30">{s.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {batches.map((b) => (
            <div
              key={b.batch_number}
              className="rounded-xl border border-white/5 bg-[#12131a] p-6"
              data-testid={`admin-batch-${b.batch_number}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-white/40">Batch</div>
                  <div className="font-serif text-4xl text-[#d4af37]">#{b.batch_number}</div>
                </div>

                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    b.status === "drawn"
                      ? "bg-purple-500/15 text-purple-300"
                      : b.status === "full"
                        ? "bg-amber-500/15 text-amber-300"
                        : "bg-emerald-500/15 text-emerald-300"
                  }`}
                >
                  {b.status}
                </span>
              </div>

              <div className="mt-4 mb-2">
                <div className="mb-1 flex justify-between text-xs text-white/50">
                  <span>Filled</span>
                  <span>{b.approved_count}/3</span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full bg-[#d4af37]" style={{ width: `${b.approved_count}%` }} />
                </div>
              </div>

              {b.status === "drawn" ? (
                <div className="mt-4 rounded-lg border border-[#d4af37]/20 bg-[#d4af37]/10 p-3">
                  <div className="text-xs uppercase tracking-[0.25em] text-[#d4af37]">Winner</div>
                  <div className="mt-1 font-serif text-xl">{b.winner_name}</div>
                  <div className="text-xs text-white/50">Ticket #{b.winner_ticket_number}</div>
                </div>
              ) : b.approved_count >= 3 ? (
                <button
                  onClick={() => draw(b.batch_number)}
                  className="btn-gold mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm"
                  data-testid={`draw-${b.batch_number}`}
                >
                  <Dice5 className="h-4 w-4" /> Draw Winner
                </button>
              ) : (
                <div className="mt-4 text-xs text-white/40">
                  Need {3 - b.approved_count} more approvals
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Screenshot preview */}
      {preview && (
        <div
          onClick={() => setPreview(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          data-testid="screenshot-modal"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#12131a] p-6"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-white/40">
                  Payment proof
                </div>
                <h3 className="mt-1 font-serif text-2xl">{preview.full_name}</h3>
                <div className="mt-1 text-xs text-white/50">
                  Ref: {preview.upi_reference || "—"}
                </div>
              </div>

              <button
                onClick={() => setPreview(null)}
                className="rounded-md p-2 hover:bg-white/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <img
              src={preview.payment_screenshot}
              alt="proof"
              className="max-h-[70vh] w-full rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}