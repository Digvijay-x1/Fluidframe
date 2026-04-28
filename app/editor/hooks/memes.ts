"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Meme, MemesOptions } from "../types";

const memeCache: {
  data: Meme[] | null;
  timestamp: number | null;
} = {
  data: null,
  timestamp: null,
};

export function Memes(options: MemesOptions = {}) {
  const {
    limit = 20,
    enableCache = true,
    cacheTime = 5 * 60 * 1000,
  } = options;

  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const abortControllerRef = useRef<AbortController | null>(null);

  const isCacheValid = useCallback(() => {
    if (!enableCache || !memeCache.data || !memeCache.timestamp) {
      return false;
    }
    return Date.now() - memeCache.timestamp < cacheTime;
  }, [enableCache, cacheTime]);

  const fetchMemes = useCallback(
    async (pageNum: number, append: boolean = false) => {
      if (pageNum === 1 && isCacheValid()) {
        setMemes(memeCache.data!);
        setLoading(false);
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/imagekit/memes?page=${pageNum}&limit=${limit}`,
          {
            signal: abortControllerRef.current.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        let newMemes: Meme[] = [];
        if (Array.isArray(data)) {
          newMemes = data;
        } else if (data.memes && Array.isArray(data.memes)) {
          newMemes = data.memes;
        }

        setHasMore(newMemes.length === limit);

        if (append) {
          setMemes((prev) => [...prev, ...newMemes]);
        } else {
          setMemes(newMemes);
          if (enableCache && pageNum === 1) {
            memeCache.data = newMemes;
            memeCache.timestamp = Date.now();
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        console.error("Failed to fetch memes:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setMemes(append ? memes : []);
      } finally {
        setLoading(false);
      }
    },
    [limit, isCacheValid, enableCache, memes]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  const refresh = useCallback(() => {
    memeCache.data = null;
    memeCache.timestamp = null;
    setPage(1);
    fetchMemes(1, false);
  }, [fetchMemes]);

  useEffect(() => {
    fetchMemes(page, page > 1);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [page]);

  return { memes, loading, error, hasMore, loadMore, refresh };
}
