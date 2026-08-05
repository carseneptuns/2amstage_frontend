import { useEffect, useState, useCallback } from "react";
import api, { apiErrorMessage } from "../lib/api";

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/events");
      // Soonest first
      const sorted = [...res.data].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
      setEvents(sorted);
    } catch (err) {
      setError(apiErrorMessage(err, "Gagal memuat daftar konser."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { events, loading, error, refetch };
}

export function useEvent(id) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      setError(apiErrorMessage(err, "Konser tidak ditemukan."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { event, loading, error, refetch };
}
