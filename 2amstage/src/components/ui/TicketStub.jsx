/**
 * Signature element of 2AMSTAGE: a physical concert-ticket silhouette.
 * `main` renders the large left portion, `stub` the perforated right portion.
 * Pass `stubWidth` (px) to control stub column width.
 */
export default function TicketStub({ main, stub, stubWidth = 120, className = "" }) {
  return (
    <div
      className={`ticket-stub flex overflow-hidden rounded-2xl border border-black/10 bg-surface ${className}`}
    >
      <div className="min-w-0 flex-1">{main}</div>
      <div
        className="ticket-perforation relative flex shrink-0 flex-col items-center justify-center border-l border-dashed border-black/15 bg-surface2 px-3 py-4 text-center"
        style={{ width: stubWidth }}
      >
        {stub}
      </div>
    </div>
  );
}
