const KEY = "2amstage-ticket-cache";

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function writeAll(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

// Call right after a successful /orders/:id/pay response.
export function cacheOrderTickets(orderId, { eventId, eventNama, ticketCodes }) {
  const all = readAll();
  all[orderId] = { eventId, eventNama, ticketCodes, cachedAt: Date.now() };
  writeAll(all);
}

export function getCachedOrder(orderId) {
  return readAll()[orderId] || null;
}

export function getAllCachedOrders() {
  return readAll();
}

// Returns the set of ticket_codes already claimed by a cached order (used to
// figure out which tickets from /tickets/my are "unassigned" for display).
export function getAllCachedTicketCodes() {
  const all = readAll();
  return new Set(Object.values(all).flatMap((o) => o.ticketCodes || []));
}
