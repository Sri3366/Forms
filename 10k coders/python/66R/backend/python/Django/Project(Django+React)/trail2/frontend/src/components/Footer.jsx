export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-white/40 md:flex-row md:px-12">
        <div className="font-serif text-lg text-white/70">
          Lumière<span className="text-[#d4af37]">.</span> Lottery
        </div>

        <div className="text-xs uppercase tracking-wider">
          ₹150 Ticket · 3 Players · 1 Winner
        </div>

        <div className="text-xs">© {new Date().getFullYear()} All rights reserved.</div>
      </div>
    </footer>
  );
}