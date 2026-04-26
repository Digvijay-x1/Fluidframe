"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Wallpaper } from "../types";

interface UseWallpapersOptions {
  limit?: number;
  enableCache?: boolean;
  cacheTime?: number;
}

const wallpaperCache: {
  data: Wallpaper[] | null;
  timestamp: number | null;
} = {
  data: null,
  timestamp: null,
};

export function Wallpapers(options: UseWallpapersOptions = {}) {
  const {
    limit = 50,
    enableCache = true,
    cacheTime = 5 * 60 * 1000,
  } = options;

  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const abortControllerRef = useRef<AbortController | null>(null);

  const isCacheValid = useCallback(() => {
    if (!enableCache || !wallpaperCache.data || !wallpaperCache.timestamp) {
      return false;
    }
    return Date.now() - wallpaperCache.timestamp < cacheTime;
  }, [enableCache, cacheTime]);

  const fetchWallpapers = useCallback(
    async (pageNum: number, append: boolean = false) => {
      if (pageNum === 1 && isCacheValid()) {
        setWallpapers(wallpaperCache.data!);
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
          `/api/imagekit/wallpapers?page=${pageNum}&limit=${limit}`,
          {
            signal: abortControllerRef.current.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        let newWallpapers: Wallpaper[] = [];
        if (Array.isArray(data)) {
          newWallpapers = data;
        } else if (data.wallpapers && Array.isArray(data.wallpapers)) {
          newWallpapers = data.wallpapers;
        }

        setHasMore(newWallpapers.length === limit);

        if (append) {
          setWallpapers((prev) => [...prev, ...newWallpapers]);
        } else {
          setWallpapers(newWallpapers);
          if (enableCache && pageNum === 1) {
            wallpaperCache.data = newWallpapers;
            wallpaperCache.timestamp = Date.now();
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        console.error("Failed to fetch wallpapers:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setWallpapers(append ? wallpapers : []);
      } finally {
        setLoading(false);
      }
    },
    [limit, isCacheValid, enableCache, wallpapers]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  const refresh = useCallback(() => {
    wallpaperCache.data = null;
    wallpaperCache.timestamp = null;
    setPage(1);
    fetchWallpapers(1, false);
  }, [fetchWallpapers]);

  useEffect(() => {
    fetchWallpapers(page, page > 1);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [page]);

  return { wallpapers, loading, error, hasMore, loadMore, refresh };
}
