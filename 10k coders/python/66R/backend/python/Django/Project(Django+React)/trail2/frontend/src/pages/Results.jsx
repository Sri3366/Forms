import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Trophy, Hash } from "lucide-react";

export default function Results() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    api.get("/results").then((r) => setResults(r.data));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:px-12">
      <div className="mb-3 text-xs uppercase tracking-[0.3em] text-[#d4af37]">
        Hall of Winners
      </div>

      <h1 className="mb-3 font-serif text-4xl lg:text-5xl" data-testid="results-title">
        Past draws
      </h1>

      <p className="mb-12 text-white/50">
        Each completed batch is sealed with a public, verifiable winner.
      </p>

      {results.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center" data-testid="results-empty">
          <Trophy className="mx-auto mb-4 h-10 w-10 text-[#d4af37]/40" />
          <div className="text-white/50">No batches drawn yet. Be the first to fill one!</div>
        </div>
      ) : (
        <div className="space-y-5">
          {results.map((b) => (
            <div
              key={b.batch_number}
              className="glass flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6 md:p-8"
              data-testid={`result-batch-${b.batch_number}`}
            >
              <div className="flex items-center gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#d4af37]/15">
                  <Trophy className="h-6 w-6 text-[#d4af37]" />
                </div>

                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-white/40">
                    Batch {b.batch_number}
                  </div>

                  <div className="mt-1 font-serif text-2xl">{b.winner_name}</div>

                  <div className="mt-1 inline-flex items-center gap-1 text-sm text-white/45">
                    <Hash className="h-3 w-3" /> Ticket #{b.winner_ticket_number}
                  </div>
                </div>
              </div>

              <div className="font-mono text-xs text-white/30">
                {b.drawn_at ? new Date(b.drawn_at).toLocaleString() : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}