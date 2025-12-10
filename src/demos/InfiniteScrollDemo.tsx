import { useState, useRef, useCallback, useEffect } from "react";
import styled from "styled-components";
import MetricsCard from "../components/MetricsCard";
import { mockWorkflows } from "../mockData/workflows";

const InfiniteScrollDemo = () => {
  // 최적화 전: 모든 데이터 한 번에 로드
  const [beforeItems] = useState(
    Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      title: `항목 ${i + 1}`,
      description: `이것은 ${i + 1}번째 항목입니다.`,
    }))
  );
  const [beforeLoadTime, setBeforeLoadTime] = useState(0);
  const [beforeInitialized, setBeforeInitialized] = useState(false);

  // 최적화 후: 무한 스크롤
  const [afterItems, setAfterItems] = useState<typeof beforeItems>([]);
  const [afterPage, setAfterPage] = useState(0);
  const [afterLoading, setAfterLoading] = useState(false);
  const [afterApiCalls, setAfterApiCalls] = useState(0);
  const observerTarget = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 10;

  // 최적화 전: 초기 로딩 시간 측정
  const handleBeforeLoad = () => {
    const start = performance.now();
    setBeforeInitialized(true);
    // 100개 아이템 전체 로딩 시뮬레이션
    setTimeout(() => {
      const end = performance.now();
      setBeforeLoadTime(end - start);
    }, 800); // 800ms 지연 시뮬레이션
  };

  // 최적화 후: 페이지별 로드
  const loadMoreItems = useCallback(() => {
    if (afterLoading) return;

    setAfterLoading(true);
    setAfterApiCalls((prev) => prev + 1);

    // API 호출 시뮬레이션
    setTimeout(() => {
      const start = afterPage * ITEMS_PER_PAGE;
      const newItems = Array.from({ length: ITEMS_PER_PAGE }, (_, i) => ({
        id: start + i + 1,
        title: `항목 ${start + i + 1}`,
        description: `이것은 ${start + i + 1}번째 항목입니다.`,
      }));

      setAfterItems((prev) => [...prev, ...newItems]);
      setAfterPage((prev) => prev + 1);
      setAfterLoading(false);
    }, 300);
  }, [afterPage, afterLoading]);

  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && afterItems.length < 100) {
          loadMoreItems();
        }
      },
      { threshold: 0.5 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMoreItems, afterItems.length]);

  // 초기 로드
  useEffect(() => {
    if (afterItems.length === 0) {
      loadMoreItems();
    }
  }, []);

  return (
    <Container>
      {/* 무한 스크롤 개념 설명 섹션 */}
      <ConceptCard>
        <ConceptTitle>무한 스크롤(Infinite Scroll)이란?</ConceptTitle>
        <ConceptDescription>
          스크롤 위치에 따라 필요한 데이터만 점진적으로 로드하는 성능 최적화
          기법
        </ConceptDescription>
        <ConceptList>
          <ConceptItem>
            <ConceptLabel>일반적인 방식</ConceptLabel>
            <ConceptText>
              페이지 진입 시 모든 데이터 로드 {"→"} 초기 로딩 시간 증가 {"→"}{" "}
              불필요한 데이터 낭비
            </ConceptText>
          </ConceptItem>
          <ConceptItem>
            <ConceptLabel>무한 스크롤</ConceptLabel>
            <ConceptText>
              초기에 일부만 로드 {"→"} 스크롤 시점에 추가 로드 {"→"} 빠른 초기
              렌더링
            </ConceptText>
          </ConceptItem>
        </ConceptList>
        <BenefitBox>
          <BenefitTitle>개선 효과</BenefitTitle>
          <BenefitText>
            • 초기 로딩 속도: 전체 데이터 대신 일부만 로드하여 빠른 첫 화면 표시
            <br />
            • 서버 부하 감소: 필요한 시점에만 API 호출
            <br />• 사용자 경험: 페이지 전환 없이 자연스러운 콘텐츠 탐색
          </BenefitText>
        </BenefitBox>
      </ConceptCard>
      <DemoTitle>무한 스크롤 비교</DemoTitle>
      <DemoDescription>
        아래 두 박스를 스크롤해보세요! 왼쪽은 모든 데이터를 한 번에 로드하고,
        오른쪽은 스크롤할 때마다 필요한 데이터만 로드합니다.
      </DemoDescription>

      {/* 인터랙티브 비교 데모 */}
      <ComparisonGrid>
        {/* 최적화 전 */}
        <DemoBox>
          <BoxTitle>❌ 최적화 전</BoxTitle>
          <Description>
            • 100개 항목 전체 로드
            <br />
            • 초기 로딩 시간 증가
            <br />• 불필요한 메모리 사용
          </Description>

          {!beforeInitialized ? (
            <LoadButton onClick={handleBeforeLoad}>
              📥 100개 항목 전체 로드 (시작)
            </LoadButton>
          ) : (
            <>
              <MetricsGrid>
                <MetricsCard
                  label="로딩 시간"
                  value={`${beforeLoadTime.toFixed(0)}ms`}
                  color="#ff6b6b"
                />
                <MetricsCard
                  label="로드된 항목"
                  value={`${beforeItems.length}개`}
                  color="#ff6b6b"
                />
                <MetricsCard label="API 호출" value="1회" color="#ff6b6b" />
              </MetricsGrid>

              <ScrollableList>
                {beforeLoadTime > 0 ? (
                  beforeItems.map((item) => (
                    <ListItem key={item.id}>
                      <ItemTitle>{item.title}</ItemTitle>
                      <ItemDescription>{item.description}</ItemDescription>
                    </ListItem>
                  ))
                ) : (
                  <LoadingBox>⏳ 모든 데이터 로딩 중... (800ms)</LoadingBox>
                )}
              </ScrollableList>
            </>
          )}
        </DemoBox>

        {/* 최적화 후 */}
        <DemoBox>
          <BoxTitle>✅ 최적화 후</BoxTitle>
          <Description>
            • 10개씩 점진적 로드
            <br />
            • 빠른 초기 렌더링
            <br />• 효율적 메모리 관리
          </Description>

          <MetricsGrid>
            <MetricsCard label="로딩 시간" value="300ms" color="#51cf66" />
            <MetricsCard
              label="로드된 항목"
              value={`${afterItems.length}개`}
              color="#51cf66"
            />
            <MetricsCard
              label="API 호출"
              value={`${afterApiCalls}회`}
              color="#51cf66"
            />
          </MetricsGrid>

          <ScrollableList>
            {afterItems.map((item) => (
              <ListItem key={item.id} $optimized>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemDescription>{item.description}</ItemDescription>
              </ListItem>
            ))}

            {afterItems.length < 100 && (
              <div ref={observerTarget}>
                {afterLoading && (
                  <LoadingBox $optimized>
                    ⚡ 다음 10개 로딩 중... (300ms)
                  </LoadingBox>
                )}
              </div>
            )}

            {afterItems.length >= 100 && (
              <CompletedBox>✅ 모든 항목 로드 완료!</CompletedBox>
            )}
          </ScrollableList>
        </DemoBox>
      </ComparisonGrid>

      {/* 개선 요약 */}
      <SummaryCard>
        <SummaryTitle>📊 성능 비교</SummaryTitle>
        <ImprovementGrid>
          <ImprovementItem>
            <ImprovementLabel>초기 로딩 속도</ImprovementLabel>
            <ImprovementValue>62% ↑</ImprovementValue>
            <ImprovementNote>(800ms → 300ms)</ImprovementNote>
          </ImprovementItem>
          <ImprovementItem>
            <ImprovementLabel>초기 메모리 사용</ImprovementLabel>
            <ImprovementValue>90% ↓</ImprovementValue>
            <ImprovementNote>(100개 → 10개)</ImprovementNote>
          </ImprovementItem>
        </ImprovementGrid>
      </SummaryCard>

      {/* 실제 적용 사례 */}
      <Divider />

      <RealCaseSection>
        <RealCaseTitle>🎯 AIDO 프로젝트 실제 적용 사례</RealCaseTitle>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          실제 구현 영상
        </h2>
        <VideoWrapper>
          <StyledVideo
            src="/videos/infiniteScroll.mov"
            loop
            muted
            playsInline
            controls
          />
        </VideoWrapper>

        <Description>
          <p>
            영상 설명 :<br></br> 네트워크 탭에서{" "}
            <strong>events?page=1&limit=20</strong> 이런식으로 호출되는 API가
            있을 때, 스크롤에 따라 page를 증가시켜서 호출하는 것을 확인할 수
            있습니다.
          </p>
        </Description>

        {/* <SummaryCard>
          <SummaryTitle>📊 무한 스크롤의 효과</SummaryTitle>
          <SummaryText>
            무한 스크롤을 구현하면 사용자가 스크롤할 때만 필요한 데이터를
            로드하여 초기 로딩 시간을 대폭 단축하고 네트워크 리소스를 효율적으로
            사용할 수 있습니다.
            <br />
            <br />
            <strong>✨ 주요 장점:</strong>
            <br />
            • 초기 페이지 로딩 속도 향상 (전체 데이터 대신 일부만 로드)
            <br />
            • 필요한 시점에만 API 호출로 서버 부하 감소
            <br />
            • 페이지네이션 대비 끊김 없는 사용자 경험
            <br />
            • 메모리 효율적 관리 (보이는 영역 중심 렌더링)
            <br />
            <br />위 영상은 AIDO 프로젝트에 실제로 적용한 결과로, 스크롤에 따라
            네트워크 탭에서 API가 필요한 시점에만 호출되는 것을 확인할 수
            있습니다.
          </SummaryText>
        </SummaryCard> */}
      </RealCaseSection>
    </Container>
  );
};

// Styled Components

const DemoTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 15px;
  color: #333;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const DemoDescription = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
  text-align: center;
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
  display: flex;
  flex-direction: column;
`;

const BoxTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
`;

const Description = styled.p`
  color: #666;
  line-height: 1.8;
  margin-bottom: 20px;

  h2 {
    color: #6b7c93;
    margin-bottom: 10px;
    font-size: 1.5rem;
  }

  p {
    font-size: 1rem;
  }
`;

const LoadButton = styled.button`
  width: 100%;
  padding: 15px;
  font-size: 1.1rem;
  font-weight: bold;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
`;

const ScrollableList = styled.div`
  height: 400px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  padding: 10px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const ListItem = styled.div<{ $optimized?: boolean }>`
  padding: 15px;
  margin-bottom: 10px;
  background: ${(props) => (props.$optimized ? "#f0fdf4" : "#fff5f5")};
  border: 1px solid ${(props) => (props.$optimized ? "#51cf66" : "#ff6b6b")};
  border-radius: 8px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(5px);
  }
`;

const ItemTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`;

const ItemDescription = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const LoadingBox = styled.div<{ $optimized?: boolean }>`
  padding: 20px;
  background: ${(props) => (props.$optimized ? "#d4edda" : "#fff3bf")};
  border-radius: 8px;
  color: ${(props) => (props.$optimized ? "#155724" : "#856404")};
  text-align: center;
  font-weight: 500;
  margin: 10px 0;
`;

const CompletedBox = styled.div`
  padding: 20px;
  background: #d4edda;
  border-radius: 8px;
  color: #155724;
  text-align: center;
  font-weight: bold;
  margin: 10px 0;
`;

const SummaryCard = styled.div`
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 15px;
  padding: 30px;
  color: #1e40af;
  border: 1px solid #bfdbfe;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
`;

const SummaryTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #1e3a8a;
  font-weight: 600;
`;

const SummaryText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #1e40af;
  margin-top: 15px;
`;

const ImprovementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const ImprovementItem = styled.div`
  text-align: center;
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 2px solid #93c5fd;
`;

const ImprovementLabel = styled.div`
  font-size: 0.9rem;
  margin-bottom: 8px;
  color: #1e40af;
  font-weight: 500;
`;

const ImprovementValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #2563eb;
  margin-bottom: 5px;
`;

const ImprovementNote = styled.div`
  font-size: 0.85rem;
  color: #64748b;
`;

const Divider = styled.div`
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ddd, transparent);
  margin: 40px 0;
`;

const RealCaseSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RealCaseTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const VideoWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const StyledVideo = styled.video`
  width: 100%;
  height: auto;
  display: block;
`;

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

export default InfiniteScrollDemo;
