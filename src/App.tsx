import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import styled from "styled-components";
import CachingDemo from "./demos/CachingDemo";
import OptimisticUIDemo from "./demos/OptimisticUIDemo";
import PrefetchingDemo from "./demos/PrefetchingDemo";
import DebounceDemo from "./demos/DebounceDemo";
import ComparisonTable from "./components/ComparisonTable";
import InfiniteScrollDemo from "./demos/InfiniteScrollDemo.tsx";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const demos = [
  {
    id: "caching",
    title: "캐싱 전략",
    component: CachingDemo,
    description: "React Query를 활용한 데이터 캐싱",
  },
  {
    id: "optimistic",
    title: "Optimistic UI",
    component: OptimisticUIDemo,
    description: "즉각적인 UI 피드백으로 UX 개선",
  },
  // {
  //   id: "prefetch",
  //   title: "Prefetching",
  //   component: PrefetchingDemo,
  //   description: "사용자 행동 예측으로 로딩 시간 제로화",
  // },
  {
    id: "debounce",
    title: "Debouncing",
    component: DebounceDemo,
    description: "불필요한 API 호출 제거",
  },

  {
    id: "InfiniteScroll",
    title: "Infinite Scroll",
    component: InfiniteScrollDemo,
    description: "무한 스크롤 구현",
  },
];

function App() {
  const [selectedDemo, setSelectedDemo] = useState("caching");

  const DemoComponent = demos.find((d) => d.id === selectedDemo)?.component;

  return (
    <QueryClientProvider client={queryClient}>
      <Container>
        <Header>
          <Title>API 최적화 성과 데모</Title>
          <Subtitle>
            프론트엔드 개발자의 API 통신 최적화 기법을 직접 체험해보세요!
          </Subtitle>
          <Author>
            Built with React + TypeScript + React Query + Recharts
          </Author>
        </Header>

        <DemoSelector>
          {demos.map((demo) => (
            <DemoTab
              key={demo.id}
              $active={selectedDemo === demo.id}
              onClick={() => setSelectedDemo(demo.id)}
            >
              <TabTitle>{demo.title}</TabTitle>
              <TabDescription>{demo.description}</TabDescription>
            </DemoTab>
          ))}
        </DemoSelector>

        <DemoContent>{DemoComponent && <DemoComponent />}</DemoContent>

        <ComparisonTable />

        <Footer>
          <FooterContent>
            <p>💡 모든 데이터는 시뮬레이션이며 실제 서버 없이 동작합니다.</p>
            <p>
              이 데모는 프론트엔드 최적화 기법의 효과를 시각적으로 보여주기 위해
              제작되었습니다.
            </p>
            <TechStack>
              <TechBadge>React</TechBadge>
              <TechBadge>TypeScript</TechBadge>
              <TechBadge>React Query</TechBadge>
              <TechBadge>Recharts</TechBadge>
              <TechBadge>Styled Components</TechBadge>
              <TechBadge>Framer Motion</TechBadge>
            </TechStack>
          </FooterContent>
        </Footer>
      </Container>
    </QueryClientProvider>
  );
}

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
`;

const Header = styled.header`
  text-align: center;
  color: #2d3748;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 10px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Author = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 10px;
`;

const DemoSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  max-width: 1200px;
  margin: 0 auto 30px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const DemoTab = styled.button<{ $active: boolean }>`
  padding: 20px;
  border: none;
  border-radius: 15px;
  background: ${(props) => (props.$active ? "white" : "rgba(255,255,255,0.4)")};
  color: ${(props) => (props.$active ? "#6b7c93" : "#2d3748")};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    background: ${(props) =>
      props.$active ? "white" : "rgba(255,255,255,0.6)"};
  }
`;

const TabTitle = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 8px;
`;

const TabDescription = styled.div`
  font-size: 0.85rem;
  opacity: 0.8;
  line-height: 1.4;
`;

const DemoContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
`;

const Footer = styled.footer`
  text-align: center;
  color: #2d3748;
  margin-top: 60px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const FooterContent = styled.div`
  background: rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  padding: 30px;
  backdrop-filter: blur(10px);

  p {
    margin: 10px 0;
    opacity: 0.9;
  }
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const TechBadge = styled.span`
  padding: 6px 12px;
  background: rgba(107, 124, 147, 0.2);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
`;

export default App;
