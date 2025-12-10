import { useState, useCallback } from "react";

interface SimulatedAPIOptions {
  delay: number; // 인위적 지연 (ms)
  shouldFail?: boolean; // 실패 시뮬레이션
  failureRate?: number; // 실패 확률 (0-1)
}

interface APIResult<T> {
  data: T;
  responseTime: number;
  fromCache: boolean;
  timestamp: number;
}

interface UseSimulatedAPIReturn<T> {
  fetchData: () => Promise<APIResult<T>>;
  isLoading: boolean;
  result: T | null;
  callCount: number;
  avgResponseTime: number;
  totalTime: number;
  errors: number;
  reset: () => void;
}

/**
 * API 호출을 시뮬레이션하는 Hook
 * 실제 네트워크 지연을 재현하여 최적화 효과를 시각적으로 보여줍니다.
 */
export const useSimulatedAPI = <T>(
  data: T,
  options: SimulatedAPIOptions
): UseSimulatedAPIReturn<T> => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<T | null>(null);
  const [callCount, setCallCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [errors, setErrors] = useState(0);

  const fetchData = useCallback(async (): Promise<APIResult<T>> => {
    setIsLoading(true);
    setCallCount((prev) => prev + 1);

    const startTime = performance.now();

    try {
      // 🎭 네트워크 지연 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, options.delay));

      // 실패 시뮬레이션
      if (
        options.shouldFail ||
        (options.failureRate && Math.random() < options.failureRate)
      ) {
        throw new Error("시뮬레이션된 API 에러");
      }

      const endTime = performance.now();
      const responseTime = endTime - startTime;

      setTotalTime((prev) => prev + responseTime);
      setResult(data);

      return {
        data,
        responseTime,
        fromCache: false,
        timestamp: Date.now(),
      };
    } catch (error) {
      setErrors((prev) => prev + 1);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [data, options.delay, options.shouldFail, options.failureRate]);

  const reset = useCallback(() => {
    setCallCount(0);
    setTotalTime(0);
    setErrors(0);
    setResult(null);
  }, []);

  return {
    fetchData,
    isLoading,
    result,
    callCount,
    avgResponseTime: callCount > 0 ? Math.round(totalTime / callCount) : 0,
    totalTime: Math.round(totalTime),
    errors,
    reset,
  };
};

/**
 * 캐싱된 API 호출을 시뮬레이션하는 Hook
 */
export const useCachedSimulatedAPI = <T>(
  data: T,
  options: SimulatedAPIOptions & { cacheTime?: number }
) => {
  const [cache, setCache] = useState<{ data: T; timestamp: number } | null>(
    null
  );
  const [cacheHits, setCacheHits] = useState(0);
  const baseAPI = useSimulatedAPI(data, options);

  const fetchData = useCallback(async (): Promise<APIResult<T>> => {
    const now = Date.now();
    const cacheTime = options.cacheTime || 5 * 60 * 1000; // 기본 5분

    // 캐시가 유효한 경우
    if (cache && now - cache.timestamp < cacheTime) {
      setCacheHits((prev) => prev + 1);
      return {
        data: cache.data,
        responseTime: 0,
        fromCache: true,
        timestamp: now,
      };
    }

    // 캐시가 없거나 만료된 경우
    const result = await baseAPI.fetchData();
    setCache({ data: result.data, timestamp: now });
    return result;
  }, [cache, options.cacheTime, baseAPI]);

  return {
    ...baseAPI,
    fetchData,
    cacheHits,
    reset: () => {
      baseAPI.reset();
      setCache(null);
      setCacheHits(0);
    },
  };
};
