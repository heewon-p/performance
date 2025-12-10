import { useState, useEffect } from "react";
import styled from "styled-components";
import { mockWorkflows } from "../mockData/workflows";
import MetricsCard from "../components/MetricsCard";

const DebounceDemo = () => {
  const [beforeSearchTerm, setBeforeSearchTerm] = useState("");
  const [afterSearchTerm, setAfterSearchTerm] = useState("");

  const [beforeResults, setBeforeResults] = useState(mockWorkflows);
  const [afterResults, setAfterResults] = useState(mockWorkflows);

  const [beforeApiCalls, setBeforeApiCalls] = useState(0);
  const [afterApiCalls, setAfterApiCalls] = useState(0);

  // ❌ 최적화 전: 매 입력마다 API 호출
  useEffect(() => {
    if (beforeSearchTerm !== "") {
      setBeforeApiCalls((prev) => prev + 1);
    }

    // 검색 시뮬레이션
    const filtered = mockWorkflows.filter((w) =>
      w.name.toLowerCase().includes(beforeSearchTerm.toLowerCase())
    );
    setBeforeResults(filtered);
  }, [beforeSearchTerm]);

  // ✅ 최적화 후: Debounce (500ms 대기)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (afterSearchTerm !== "") {
        setAfterApiCalls((prev) => prev + 1);
      }

      // 검색 시뮬레이션
      const filtered = mockWorkflows.filter((w) =>
        w.name.toLowerCase().includes(afterSearchTerm.toLowerCase())
      );
      setAfterResults(filtered);
    }, 500);

    return () => clearTimeout(handler);
  }, [afterSearchTerm]);

  const calculateSaved = () => {
    const potentialCalls = beforeSearchTerm.length;
    const actualCalls = afterApiCalls;
    return potentialCalls > 0 ? potentialCalls - actualCalls : 0;
  };

  return (
    <DemoContainer>
      {/* 디바운싱 개념 설명 섹션 추가 */}
      <ConceptCard>
        <ConceptTitle>디바운싱(Debouncing)이란?</ConceptTitle>
        <ConceptDescription>
          연속된 이벤트를 그룹화하여 마지막 이벤트만 처리하는 성능 최적화 기법
        </ConceptDescription>
        <ConceptList>
          <ConceptItem>
            <ConceptLabel>디바운싱 미적용</ConceptLabel>
            <ConceptText>
              모든 입력 이벤트마다 즉시 처리 {"→"} 과도한 연산 및 API 호출 {"→"}{" "}
              서버 부하 증가
            </ConceptText>
          </ConceptItem>
          <ConceptItem>
            <ConceptLabel>디바운싱 적용</ConceptLabel>
            <ConceptText>
              일정 시간 대기 {"→"} 추가 입력 없으면 처리 {"→"} 불필요한 호출
              제거
            </ConceptText>
          </ConceptItem>
        </ConceptList>
        <BenefitBox>
          <BenefitTitle>개선 효과</BenefitTitle>
          <BenefitText>
            • API 호출 감소: 연속 입력 시 최종 값만 전송하여 호출 횟수 대폭 감소
            <br />
            • 서버 부하 절감: 불필요한 요청 제거로 서버 리소스 절약
            <br />• 적용 사례: 검색 자동완성, 실시간 검색, 입력 필터링 등
          </BenefitText>
        </BenefitBox>
      </ConceptCard>
      <DemoTitle>⏱️ Debouncing 비교</DemoTitle>
      <DemoDescription>
        검색창에 "워크플로우"를 입력해보세요! 왼쪽은 매 글자마다 API 호출,
        오른쪽은 입력이 끝난 후 한 번만 호출합니다.
      </DemoDescription>

      <ComparisonGrid>
        {/* 최적화 전 */}
        <DemoBox>
          <BoxTitle>❌ 최적화 전</BoxTitle>
          <Description>
            • 매 입력마다 API 호출
            <br />
            • 불필요한 요청 다수
            <br />• 서버 부하 증가
          </Description>

          <SearchInput
            type="text"
            placeholder="검색어 입력..."
            value={beforeSearchTerm}
            onChange={(e) => setBeforeSearchTerm(e.target.value)}
          />

          <MetricsGrid>
            <MetricsCard
              label="API 호출 수"
              value={beforeApiCalls}
              color="#ff6b6b"
            />
            <MetricsCard
              label="검색 결과"
              value={`${beforeResults.length}개`}
              color="#ff6b6b"
            />
          </MetricsGrid>

          <ResultList>
            {beforeResults.slice(0, 5).map((workflow) => (
              <ResultItem key={workflow.id}>
                <WorkflowName>{workflow.name}</WorkflowName>
                <WorkflowStatus $status={workflow.status}>
                  {workflow.status}
                </WorkflowStatus>
              </ResultItem>
            ))}
          </ResultList>

          {beforeApiCalls > 0 && (
            <WarningBox>
              ⚠️ {beforeApiCalls}번의 API 호출이 발생했습니다!
            </WarningBox>
          )}
        </DemoBox>

        {/* 최적화 후 */}
        <DemoBox>
          <BoxTitle>✅ 최적화 후</BoxTitle>
          <Description>
            • 500ms 대기 후 호출
            <br />
            • 불필요한 요청 제거
            <br />• 서버 부하 감소
          </Description>

          <SearchInput
            type="text"
            placeholder="검색어 입력..."
            value={afterSearchTerm}
            onChange={(e) => setAfterSearchTerm(e.target.value)}
            $optimized
          />

          <MetricsGrid>
            <MetricsCard
              label="API 호출 수"
              value={afterApiCalls}
              color="#51cf66"
            />
            <MetricsCard
              label="검색 결과"
              value={`${afterResults.length}개`}
              color="#51cf66"
            />
          </MetricsGrid>

          <ResultList>
            {afterResults.slice(0, 5).map((workflow) => (
              <ResultItem key={workflow.id}>
                <WorkflowName>{workflow.name}</WorkflowName>
                <WorkflowStatus $status={workflow.status}>
                  {workflow.status}
                </WorkflowStatus>
              </ResultItem>
            ))}
          </ResultList>

          {calculateSaved() > 0 && (
            <SuccessBox>
              ✅ {calculateSaved()}번의 불필요한 API 호출을 절약했습니다!
            </SuccessBox>
          )}
        </DemoBox>
      </ComparisonGrid>
      <SummaryContainer>
        {/* <SummaryCard>
          <SummaryTitle>📊 데모 성과 요약</SummaryTitle>
          <ImprovementGrid>
            <ImprovementItem>
              <ImprovementLabel>API 호출 감소</ImprovementLabel>
              <ImprovementValue>
                {beforeApiCalls > 0 && afterApiCalls > 0
                  ? `${Math.round(
                      ((beforeApiCalls - afterApiCalls) / beforeApiCalls) * 100
                    )}% ↓`
                  : "-"}
              </ImprovementValue>
            </ImprovementItem>
            <ImprovementItem>
              <ImprovementLabel>절약된 요청</ImprovementLabel>
              <ImprovementValue>{calculateSaved()}회</ImprovementValue>
            </ImprovementItem>
          </ImprovementGrid>
          <SummaryText>
            사용자가 입력을 완료할 때까지 기다렸다가 API를 호출하여 불필요한
            요청을 크게 줄일 수 있습니다. 특히 자동완성, 검색 등에 효과적입니다!
          </SummaryText>
        </SummaryCard> */}

        <Divider />

        {/* 2️⃣ AIDO 프로젝트 실제 적용 사례 */}
        <RealCaseSection>
          <RealCaseTitle>🎯 AIDO 프로젝트 실제 적용 사례</RealCaseTitle>

          <SummaryCard>
            <VideoCard>
              <ApplyDescription>
                AIDO의 검색 필터에 디바운싱을 적용하여 사용자 입력 중 발생하는
                불필요한 연산을 대폭 줄였습니다. 입력할 때마다 필터링을 수행하던
                것을 입력이 완료된 시점에만 실행하도록 최적화했습니다.
              </ApplyDescription>

              <VideoWrapper>
                <div>⚠️ 디바운스 적용 전 - 입력할 때마다 필터 연산 실행</div>
                <StyledVideo
                  src="/videos/debounce_before.mov"
                  // autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
              </VideoWrapper>
              <VideoWrapper>
                <div>✅ 디바운스 적용 후 - 입력 완료 시에만 필터 연산 실행</div>
                <StyledVideo
                  src="/videos/debounce_after.mov"
                  // autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
              </VideoWrapper>
            </VideoCard>
          </SummaryCard>

          <SummaryCard>
            <SummaryTitle>📈 실제 측정 결과</SummaryTitle>

            <MeasurementBox>
              <MeasurementGrid>
                <MeasurementItem>
                  <MeasurementLabel>적용 전</MeasurementLabel>
                  <MeasurementValue>
                    렌더링: 83회
                    <br />
                    필터링: 37회
                  </MeasurementValue>
                </MeasurementItem>
                <MeasurementItem>
                  <MeasurementLabel>적용 후</MeasurementLabel>
                  <MeasurementValue $success>
                    렌더링: 46회 (45% ↓)
                    <br />
                    필터링: 3회 (92% ↓)
                  </MeasurementValue>
                </MeasurementItem>
              </MeasurementGrid>
              <MeasurementDescription>
                💡 입력할 때마다 드롭다운 목록 전체를 검색하던 것을,
                디바운싱으로 입력 완료 시에만 검색하도록 최적화하여 필터링 연산
                92%, 렌더링 45% 감소!
              </MeasurementDescription>
            </MeasurementBox>
          </SummaryCard>
        </RealCaseSection>
      </SummaryContainer>
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

const SearchInput = styled.input<{ $optimized?: boolean }>`
  width: 100%;
  padding: 12px 15px;
  font-size: 1rem;
  border: 2px solid ${(props) => (props.$optimized ? "#51cf66" : "#ff6b6b")};
  border-radius: 8px;
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px
      ${(props) => (props.$optimized ? "#51cf6633" : "#ff6b6b33")};
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 20px;
`;

const ResultList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 15px;
`;

const ResultItem = styled.div`
  padding: 10px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const WorkflowName = styled.span`
  font-weight: 500;
  color: #333;
`;

const WorkflowStatus = styled.span<{ $status: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: bold;
  background: ${(props) =>
    props.$status === "active"
      ? "#51cf66"
      : props.$status === "paused"
      ? "#ffa94d"
      : "#868e96"};
  color: white;
`;

const WarningBox = styled.div`
  padding: 12px;
  background: #fff3bf;
  border-radius: 8px;
  color: #856404;
  text-align: center;
  font-weight: 500;
`;

const SuccessBox = styled.div`
  padding: 12px;
  background: #d4edda;
  border-radius: 8px;
  color: #155724;
  text-align: center;
  font-weight: 500;
`;

const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: 30px;
`;
const SummaryCard = styled.div`
  background: linear-gradient(135deg, #8b9aaf 0%, #6b7c93 100%);
  border-radius: 15px;
  padding: 30px;
  color: white;
`;

const SummaryTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const VideoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: center;
  width: 100%;
  /* max-width: 800px; */
  border-radius: 10px;
  overflow: hidden;
  gap: 10px;

  div {
    padding: 0 10px;
  }
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  display: block;
  padding: 10px;
  /* box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); */
`;

const VideoCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 30px;
`;

const ApplyDescription = styled.p`
  font-size: 1rem;
  color: #f0f0f0;
  line-height: 1.6;
  margin-bottom: 20px;
  text-align: center;
`;

const MeasurementBox = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
`;

const MeasurementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 10px;
`;

const MeasurementItem = styled.div`
  text-align: center;
`;

const MeasurementLabel = styled.div`
  font-size: 0.85rem;
  opacity: 0.8;
  margin-bottom: 5px;
  color: #f0f0f0;
`;

const MeasurementValue = styled.div<{ $success?: boolean }>`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${(props) => (props.$success ? "#51cf66" : "#ff6b6b")};
`;

const MeasurementDescription = styled.p`
  font-size: 0.9rem;
  color: #f0f0f0;
  opacity: 0.9;
  margin-top: 10px;
`;

const Divider = styled.div`
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ddd, transparent);
  margin: 20px 0;
`;

const RealCaseSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

const RealCaseTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  text-align: center;
  margin-bottom: 10px;
`;

// 새로운 스타일 컴포넌트 추가 (OptimisticUIDemo와 동일)
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

export default DebounceDemo;
