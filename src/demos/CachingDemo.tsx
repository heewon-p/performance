import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { mockWorkflows } from "../mockData/workflows";
import { useSimulatedAPI } from "../hooks/useSimulatedAPI";
import MetricsCard from "../components/MetricsCard";
import PerformanceChart from "../components/PerformanceChart";

const CachingDemo = () => {
  const [beforeMetrics, setBeforeMetrics] = useState({
    calls: 0,
    totalTime: 0,
    cacheHits: 0,
  });

  const [afterMetrics, setAfterMetrics] = useState({
    calls: 0,
    totalTime: 0,
    cacheHits: 0,
  });

  // ❌ 최적화 전: 캐싱 없음
  const beforeAPI = useSimulatedAPI(mockWorkflows, { delay: 800 });

  // ✅ 최적화 후: React Query 캐싱
  const queryClient = useQueryClient();
  const afterQuery = useQuery({
    queryKey: ["workflows-optimized"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 800));
      return mockWorkflows;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const handleBeforeClick = async () => {
    const startTime = performance.now();
    await beforeAPI.fetchData();
    const endTime = performance.now();

    setBeforeMetrics((prev) => ({
      calls: prev.calls + 1,
      totalTime: prev.totalTime + (endTime - startTime),
      cacheHits: 0,
    }));
  };

  const handleAfterClick = () => {
    const cached = queryClient.getQueryData(["workflows-optimized"]);
    const startTime = performance.now();

    if (cached) {
      // 캐시에서 즉시 반환
      const endTime = performance.now();
      setAfterMetrics((prev) => ({
        calls: prev.calls + 1,
        totalTime: prev.totalTime + (endTime - startTime),
        cacheHits: prev.cacheHits + 1,
      }));
    } else {
      afterQuery.refetch().then(() => {
        const endTime = performance.now();
        setAfterMetrics((prev) => ({
          calls: prev.calls + 1,
          totalTime: prev.totalTime + (endTime - startTime),
          cacheHits: prev.cacheHits,
        }));
      });
    }
  };

  return (
    <DemoContainer>
      <DemoTitle>🔄 캐싱 전략 비교</DemoTitle>
      <DemoDescription>
        버튼을 여러 번 클릭해보세요! 최적화 전은 매번 800ms가 걸리지만, 최적화
        후는 두 번째부터 즉시 반환됩니다.
      </DemoDescription>

      <ComparisonGrid>
        {/* 최적화 전 */}
        <DemoBox>
          <BoxTitle>❌ 최적화 전</BoxTitle>
          <Description>
            • 매번 API 호출
            <br />
            • 캐싱 없음
            <br />• 평균 800ms 소요
          </Description>

          <TestButton
            onClick={handleBeforeClick}
            disabled={beforeAPI.isLoading}
          >
            {beforeAPI.isLoading ? "⏳ 로딩 중..." : "🔄 데이터 로드"}
          </TestButton>

          <MetricsGrid>
            <MetricsCard
              label="API 호출"
              value={beforeMetrics.calls}
              color="#ff6b6b"
            />
            <MetricsCard
              label="평균 응답시간"
              value={`${
                beforeMetrics.calls > 0
                  ? Math.round(beforeMetrics.totalTime / beforeMetrics.calls)
                  : 0
              }ms`}
              color="#ff6b6b"
            />
            <MetricsCard
              label="캐시 히트"
              value={beforeMetrics.cacheHits}
              color="#ff6b6b"
            />
          </MetricsGrid>

          {beforeAPI.result && (
            <DataDisplay>
              ✅ 데이터 로드 완료: {beforeAPI.result.length}개 워크플로우
            </DataDisplay>
          )}
        </DemoBox>

        {/* 최적화 후 */}
        <DemoBox>
          <BoxTitle>✅ 최적화 후</BoxTitle>
          <Description>
            • React Query 캐싱
            <br />
            • 5분간 캐시 유지
            <br />• 캐시 히트 시 0ms
          </Description>

          <TestButton
            onClick={handleAfterClick}
            disabled={afterQuery.isLoading}
            $optimized
          >
            {afterQuery.isLoading ? "⏳ 로딩 중..." : "⚡ 데이터 로드"}
          </TestButton>

          <MetricsGrid>
            <MetricsCard
              label="API 호출"
              value={afterMetrics.calls}
              color="#51cf66"
            />
            <MetricsCard
              label="평균 응답시간"
              value={`${
                afterMetrics.calls > 0
                  ? Math.round(afterMetrics.totalTime / afterMetrics.calls)
                  : 0
              }ms`}
              color="#51cf66"
            />
            <MetricsCard
              label="캐시 히트"
              value={afterMetrics.cacheHits}
              color="#51cf66"
              highlight={afterMetrics.cacheHits > 0}
            />
          </MetricsGrid>

          {afterQuery.data && (
            <DataDisplay>
              ✅ 데이터 로드 완료: {afterQuery.data.length}개 워크플로우
            </DataDisplay>
          )}
        </DemoBox>
      </ComparisonGrid>

      {/* 성능 비교 차트 */}
      <PerformanceChart beforeData={beforeMetrics} afterData={afterMetrics} />

      {/* 개선 요약 */}
      <SummaryCard>
        <SummaryTitle>📊 개선 효과</SummaryTitle>
        <ImprovementGrid>
          <ImprovementItem>
            <ImprovementLabel>응답 시간 감소</ImprovementLabel>
            <ImprovementValue>
              {afterMetrics.cacheHits > 0 ? "~99% ↓" : "-"}
            </ImprovementValue>
          </ImprovementItem>
          <ImprovementItem>
            <ImprovementLabel>서버 부하 감소</ImprovementLabel>
            <ImprovementValue>
              {afterMetrics.calls > 0
                ? `${Math.round(
                    (afterMetrics.cacheHits / afterMetrics.calls) * 100
                  )}% ↓`
                : "-"}
            </ImprovementValue>
          </ImprovementItem>
        </ImprovementGrid>
      </SummaryCard>
    </DemoContainer>
  );
};

// Styled Components
const DemoContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const DemoTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 15px;
  color: #333;
`;

const DemoDescription = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DemoBox = styled.div`
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  padding: 25px;
  background: #fafafa;
`;

const BoxTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
`;

const Description = styled.p`
  color: #666;
  line-height: 1.8;
  margin-bottom: 20px;
`;

const TestButton = styled.button<{ $optimized?: boolean }>`
  width: 100%;
  padding: 15px;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) => (props.$optimized ? "#51cf66" : "#ff6b6b")};
  color: white;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 20px;
`;

const DataDisplay = styled.div`
  margin-top: 15px;
  padding: 12px;
  background: #e7f5ff;
  border-radius: 8px;
  color: #1971c2;
  text-align: center;
  font-weight: 500;
`;

const SummaryCard = styled.div`
  background: linear-gradient(135deg, #8b9aaf 0%, #6b7c93 100%);
  border-radius: 15px;
  padding: 30px;
  color: white;
  margin-top: 30px;
`;

const SummaryTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const ImprovementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const ImprovementItem = styled.div`
  text-align: center;
`;

const ImprovementLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 5px;
`;

const ImprovementValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
`;

export default CachingDemo;
