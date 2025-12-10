import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { mockWorkflows } from "../mockData/workflows";
import MetricsCard from "../components/MetricsCard";

const PrefetchingDemo = () => {
  const [selectedBeforeId, setSelectedBeforeId] = useState<number | null>(null);
  const [selectedAfterId, setSelectedAfterId] = useState<number | null>(null);
  const [beforeClicks, setBeforeClicks] = useState(0);
  const [afterClicks, setAfterClicks] = useState(0);
  const [beforeTotalWait, setBeforeTotalWait] = useState(0);
  const [afterTotalWait, setAfterTotalWait] = useState(0);

  const queryClient = useQueryClient();

  // ❌ 최적화 전: 클릭 후 데이터 로드
  const { data: beforeData, isLoading: beforeLoading } = useQuery({
    queryKey: ["workflow-before", selectedBeforeId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 500));
      return mockWorkflows.find((w) => w.id === selectedBeforeId);
    },
    enabled: selectedBeforeId !== null,
  });

  // ✅ 최적화 후: hover 시 미리 로드
  const { data: afterData, isLoading: afterLoading } = useQuery({
    queryKey: ["workflow-after", selectedAfterId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 500));
      return mockWorkflows.find((w) => w.id === selectedAfterId);
    },
    enabled: selectedAfterId !== null,
  });

  const handleBeforeClick = (id: number) => {
    const startTime = performance.now();
    setBeforeClicks((prev) => prev + 1);
    setSelectedBeforeId(id);

    // 로딩 완료 시간 측정
    const checkLoading = setInterval(() => {
      if (!beforeLoading) {
        const waitTime = performance.now() - startTime;
        setBeforeTotalWait((prev) => prev + waitTime);
        clearInterval(checkLoading);
      }
    }, 100);
  };

  const handleAfterHover = (id: number) => {
    // Prefetch: hover 시 미리 데이터 로드
    queryClient.prefetchQuery({
      queryKey: ["workflow-after", id],
      queryFn: async () => {
        await new Promise((r) => setTimeout(r, 500));
        return mockWorkflows.find((w) => w.id === id);
      },
    });
  };

  const handleAfterClick = (id: number) => {
    const startTime = performance.now();
    setAfterClicks((prev) => prev + 1);
    setSelectedAfterId(id);

    // 이미 prefetch된 경우 즉시 반환
    const cached = queryClient.getQueryData(["workflow-after", id]);
    if (cached) {
      setAfterTotalWait((prev) => prev + (performance.now() - startTime));
    }
  };

  const displayWorkflows = mockWorkflows.slice(0, 5);

  return (
    <DemoContainer>
      <DemoTitle>🚀 Prefetching 비교</DemoTitle>

      {/* 프리페칭 개념 설명 섹션 추가 */}
      <ConceptCard>
        <ConceptTitle>프리페칭(Prefetching)이란?</ConceptTitle>
        <ConceptDescription>
          사용자가 다음에 필요할 것으로 예상되는 데이터를 미리 로드하여 대기
          시간을 제거하는 기법
        </ConceptDescription>
        <ConceptList>
          <ConceptItem>
            <ConceptLabel>일반적인 방식</ConceptLabel>
            <ConceptText>
              사용자 클릭 {"→"} 데이터 요청 {"→"} 응답 대기 {"→"} 화면 표시
              (지연 발생)
            </ConceptText>
          </ConceptItem>
          <ConceptItem>
            <ConceptLabel>프리페칭</ConceptLabel>
            <ConceptText>
              사용자 의도 감지(hover 등) {"→"} 미리 데이터 로드 {"→"} 클릭 시
              즉시 표시
            </ConceptText>
          </ConceptItem>
        </ConceptList>
        <BenefitBox>
          <BenefitTitle>개선 효과</BenefitTitle>
          <BenefitText>
            • 체감 로딩 시간: 거의 0에 가까운 즉각적인 반응
            <br />
            • 사용자 만족도: 매끄럽고 빠른 인터랙션
            <br />• 적용 시점: 마우스 hover, 뷰포트 진입, 사용자 패턴 분석 등
          </BenefitText>
        </BenefitBox>
      </ConceptCard>

      <DemoDescription>
        왼쪽은 클릭하면 500ms 대기, 오른쪽은 hover하고 클릭하면 즉시 표시됩니다!
      </DemoDescription>

      <ComparisonGrid>
        {/* 최적화 전 */}
        <DemoBox>
          <BoxTitle>❌ 최적화 전</BoxTitle>
          <Description>
            • 클릭 후 데이터 로드
            <br />
            • 매번 500ms 대기
            <br />• 사용자 불편함
          </Description>

          <WorkflowList>
            {displayWorkflows.map((workflow) => (
              <WorkflowItem
                key={workflow.id}
                onClick={() => handleBeforeClick(workflow.id)}
                $selected={selectedBeforeId === workflow.id}
              >
                {workflow.name}
              </WorkflowItem>
            ))}
          </WorkflowList>

          {beforeLoading && <LoadingBox>⏳ 로딩 중...</LoadingBox>}

          {beforeData && !beforeLoading && (
            <DetailBox>
              <DetailTitle>{beforeData.name}</DetailTitle>
              <DetailInfo>상태: {beforeData.status}</DetailInfo>
              <DetailInfo>이벤트: {beforeData.eventCount}개</DetailInfo>
            </DetailBox>
          )}

          <MetricsGrid>
            <MetricsCard label="클릭 수" value={beforeClicks} color="#ff6b6b" />
            <MetricsCard
              label="평균 대기시간"
              value={`${
                beforeClicks > 0
                  ? Math.round(beforeTotalWait / beforeClicks)
                  : 0
              }ms`}
              color="#ff6b6b"
            />
          </MetricsGrid>
        </DemoBox>

        {/* 최적화 후 */}
        <DemoBox>
          <BoxTitle>✅ 최적화 후</BoxTitle>
          <Description>
            • hover 시 미리 로드
            <br />
            • 클릭 시 즉시 표시
            <br />• 매끄러운 UX
          </Description>

          <WorkflowList>
            {displayWorkflows.map((workflow) => (
              <WorkflowItem
                key={workflow.id}
                onMouseEnter={() => handleAfterHover(workflow.id)}
                onClick={() => handleAfterClick(workflow.id)}
                $selected={selectedAfterId === workflow.id}
                $optimized
              >
                {workflow.name}
              </WorkflowItem>
            ))}
          </WorkflowList>

          {afterLoading && <LoadingBox>⏳ 로딩 중...</LoadingBox>}

          {afterData && !afterLoading && (
            <DetailBox $optimized>
              <DetailTitle>{afterData.name}</DetailTitle>
              <DetailInfo>상태: {afterData.status}</DetailInfo>
              <DetailInfo>이벤트: {afterData.eventCount}개</DetailInfo>
              <SuccessBadge>⚡ 즉시 로드!</SuccessBadge>
            </DetailBox>
          )}

          <MetricsGrid>
            <MetricsCard label="클릭 수" value={afterClicks} color="#51cf66" />
            <MetricsCard
              label="평균 대기시간"
              value={`${
                afterClicks > 0 ? Math.round(afterTotalWait / afterClicks) : 0
              }ms`}
              color="#51cf66"
              highlight={afterClicks > 0 && afterTotalWait / afterClicks < 100}
            />
          </MetricsGrid>
        </DemoBox>
      </ComparisonGrid>

      <SummaryCard>
        <SummaryTitle>📊 Prefetching의 장점</SummaryTitle>
        <SummaryText>
          사용자가 다음에 클릭할 항목을 예측하여 미리 데이터를 로드합니다. 이를
          통해 체감 로딩 시간을 거의 0에 가깝게 만들 수 있습니다!
        </SummaryText>
      </SummaryCard>
    </DemoContainer>
  );
};

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

const WorkflowList = styled.div`
  margin: 20px 0;
`;

const WorkflowItem = styled.div<{ $selected: boolean; $optimized?: boolean }>`
  padding: 12px 15px;
  margin-bottom: 8px;
  background: ${(props) => (props.$selected ? "#e7f5ff" : "white")};
  border: 2px solid
    ${(props) =>
      props.$selected ? (props.$optimized ? "#51cf66" : "#ff6b6b") : "#e0e0e0"};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(5px);
    border-color: ${(props) => (props.$optimized ? "#51cf66" : "#ff6b6b")};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const LoadingBox = styled.div`
  padding: 20px;
  background: #fff3bf;
  border-radius: 8px;
  color: #856404;
  text-align: center;
  margin: 15px 0;
`;

const DetailBox = styled.div<{ $optimized?: boolean }>`
  padding: 20px;
  background: ${(props) => (props.$optimized ? "#d4edda" : "#f8f9fa")};
  border-radius: 8px;
  margin: 15px 0;
  border: 2px solid ${(props) => (props.$optimized ? "#51cf66" : "#e0e0e0")};
`;

const DetailTitle = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
`;

const DetailInfo = styled.p`
  color: #666;
  margin: 5px 0;
`;

const SuccessBadge = styled.div`
  margin-top: 10px;
  padding: 8px;
  background: #51cf66;
  color: white;
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 20px;
`;

const SummaryCard = styled.div`
  background: linear-gradient(135deg, #8b9aaf 0%, #6b7c93 100%);
  border-radius: 15px;
  padding: 30px;
  color: white;
`;

const SummaryTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
`;

const SummaryText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  opacity: 0.95;
`;

// 새로운 스타일 컴포넌트 추가
const ConceptCard = styled.div`
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 30px;
  color: #1e40af;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  border: 1px solid #bfdbfe;
`;

const ConceptTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 16px;
  font-weight: 600;
  color: #1e3a8a;
`;

const ConceptDescription = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 24px;
  color: #1e40af;
`;

const ConceptList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const ConceptItem = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ConceptLabel = styled.div`
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #2563eb;
`;

const ConceptText = styled.div`
  font-size: 0.95rem;
  line-height: 1.6;
  color: #475569;
`;

const BenefitBox = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 8px;
  border: 2px solid #93c5fd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const BenefitTitle = styled.h4`
  font-size: 1.15rem;
  margin-bottom: 12px;
  font-weight: 600;
  color: #1e3a8a;
`;

const BenefitText = styled.p`
  font-size: 0.95rem;
  line-height: 1.8;
  color: #475569;
`;

export default PrefetchingDemo;
