import { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import MetricsCard from "../components/MetricsCard";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const OptimisticUIDemo = () => {
  const [beforeTasks, setBeforeTasks] = useState<Task[]>([
    { id: 1, title: "첫 번째 작업", completed: false },
    { id: 2, title: "두 번째 작업", completed: false },
  ]);

  const [afterTasks, setAfterTasks] = useState<Task[]>([
    { id: 1, title: "첫 번째 작업", completed: false },
    { id: 2, title: "두 번째 작업", completed: false },
  ]);

  const [beforeLoading, setBeforeLoading] = useState(false);
  const [beforeClicks, setBeforeClicks] = useState(0);
  const [afterClicks, setAfterClicks] = useState(0);

  // ❌ 최적화 전: API 응답을 기다린 후 UI 업데이트
  const handleBeforeToggle = async (id: number) => {
    setBeforeLoading(true);
    setBeforeClicks((prev) => prev + 1);

    // 800ms 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 800));

    setBeforeTasks((tasks) =>
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    setBeforeLoading(false);
  };

  // ✅ 최적화 후: UI 즉시 업데이트 (Optimistic Update)
  const handleAfterToggle = async (id: number) => {
    setAfterClicks((prev) => prev + 1);

    // 즉시 UI 업데이트
    setAfterTasks((tasks) =>
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    // 백그라운드에서 API 호출 (실패 시 롤백 로직 포함)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      // 성공 - UI는 이미 업데이트됨
    } catch (error) {
      // 실패 시 롤백
      setAfterTasks((tasks) =>
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    }
  };

  return (
    <DemoContainer>
      {/* 낙관적 업데이트 개념 설명 섹션 추가 */}
      <ConceptCard>
        <ConceptTitle>낙관적 업데이트(Optimistic Update)란?</ConceptTitle>
        <ConceptDescription>
          서버 응답을 기다리지 않고 사용자 행동이 성공할 것이라 가정하여 즉시
          UI를 업데이트하는 기법
        </ConceptDescription>
        <ConceptList>
          <ConceptItem>
            <ConceptLabel>일반적인 방식</ConceptLabel>
            <ConceptText>
              사용자 액션 {"→"} 서버 응답 대기 {"→"} UI 업데이트 (응답 시간만큼
              지연)
            </ConceptText>
          </ConceptItem>
          <ConceptItem>
            <ConceptLabel>낙관적 업데이트</ConceptLabel>
            <ConceptText>
              사용자 액션 {"→"} 즉시 UI 업데이트 {"→"} 백그라운드 서버 처리
              (실패 시 롤백)
            </ConceptText>
          </ConceptItem>
        </ConceptList>
        <BenefitBox>
          <BenefitTitle>개선 효과</BenefitTitle>
          <BenefitText>
            • 체감 응답 속도: 즉각적인 피드백으로 앱이 빠르게 느껴짐
            <br />
            • 사용자 경험: 기다림 없이 자연스러운 인터랙션
            <br />• 신뢰성: 실패 시 자동 롤백으로 데이터 일관성 유지
          </BenefitText>
        </BenefitBox>
      </ConceptCard>
      <DemoTitle>낙관적 업데이트 비교</DemoTitle>
      <DemoDescription>
        체크박스를 클릭해보세요! 최적화 전은 800ms를 기다려야 하지만, 최적화
        후는 즉시 반영됩니다.
      </DemoDescription>

      <ComparisonGrid>
        {/* 최적화 전 */}
        <DemoBox>
          <BoxTitle>❌ 최적화 전</BoxTitle>
          <Description>
            • API 응답 대기
            <br />
            • 800ms 후 UI 업데이트
            <br />• 사용자 대기 필요
          </Description>

          <TaskList>
            {beforeTasks.map((task) => (
              <TaskItem key={task.id}>
                <Checkbox
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleBeforeToggle(task.id)}
                  disabled={beforeLoading}
                />
                <TaskText $completed={task.completed}>{task.title}</TaskText>
              </TaskItem>
            ))}
          </TaskList>

          {beforeLoading && (
            <LoadingIndicator>⏳ API 처리 중...</LoadingIndicator>
          )}

          <MetricsGrid>
            <MetricsCard label="클릭 수" value={beforeClicks} color="#ff6b6b" />
            <MetricsCard label="체감 응답시간" value="800ms" color="#ff6b6b" />
          </MetricsGrid>
        </DemoBox>

        {/* 최적화 후 */}
        <DemoBox>
          <BoxTitle>✅ 최적화 후</BoxTitle>
          <Description>
            • 즉시 UI 업데이트
            <br />
            • 백그라운드 API 호출
            <br />• 실패 시 자동 롤백
          </Description>

          <TaskList>
            <AnimatePresence>
              {afterTasks.map((task) => (
                <TaskItemAnimated
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Checkbox
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleAfterToggle(task.id)}
                  />
                  <TaskText $completed={task.completed}>{task.title}</TaskText>
                </TaskItemAnimated>
              ))}
            </AnimatePresence>
          </TaskList>

          <SuccessIndicator>⚡ 즉시 반영됨!</SuccessIndicator>

          <MetricsGrid>
            <MetricsCard label="클릭 수" value={afterClicks} color="#51cf66" />
            <MetricsCard
              label="체감 응답시간"
              value="0ms"
              color="#51cf66"
              highlight
            />
          </MetricsGrid>
        </DemoBox>
      </ComparisonGrid>

      {/* <SummaryCard>
        <SummaryTitle>📊 사용자 경험 개선</SummaryTitle>
        <SummaryText>
          Optimistic UI 패턴을 사용하면 사용자는 즉각적인 피드백을 받아 앱이
          훨씬 빠르게 느껴집니다. 실제 API 응답 시간은 동일하지만, 체감 속도는
          800ms → 0ms로 개선됩니다!
        </SummaryText>
      </SummaryCard> */}
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

const TaskList = styled.div`
  margin: 20px 0;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 10px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

const TaskItemAnimated = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 10px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  margin-right: 12px;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const TaskText = styled.span<{ $completed: boolean }>`
  font-size: 1rem;
  color: ${(props) => (props.$completed ? "#999" : "#333")};
  text-decoration: ${(props) => (props.$completed ? "line-through" : "none")};
`;

const LoadingIndicator = styled.div`
  padding: 12px;
  background: #fff3bf;
  border-radius: 8px;
  color: #856404;
  text-align: center;
  margin-top: 10px;
`;

const SuccessIndicator = styled.div`
  padding: 12px;
  background: #d4edda;
  border-radius: 8px;
  color: #155724;
  text-align: center;
  margin-top: 10px;
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

export default OptimisticUIDemo;
