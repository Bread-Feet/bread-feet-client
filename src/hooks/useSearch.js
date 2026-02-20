import { useState, useEffect } from "react";

export default function useSearch(delay = 300) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), delay);
    return () => clearTimeout(id);
  }, [query, delay]);

  return {
    query,
    debouncedQuery,
    setQuery,
    clearQuery: () => setQuery(""),
  };
}
