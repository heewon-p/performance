export interface Workflow {
  id: number;
  name: string;
  status: "active" | "paused" | "completed";
  createdAt: string;
  description: string;
  eventCount: number;
}

// 50개의 워크플로우 목데이터
export const mockWorkflows: Workflow[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `워크플로우 ${i + 1}`,
  status: ["active", "paused", "completed"][Math.floor(Math.random() * 3)] as
    | "active"
    | "paused"
    | "completed",
  createdAt: new Date(2024, 0, i + 1).toISOString(),
  description: `워크플로우 ${i + 1}에 대한 설명입니다.`,
  eventCount: Math.floor(Math.random() * 100) + 10,
}));

// 상태별로 필터링된 워크플로우
export const getWorkflowsByStatus = (status: Workflow["status"]) => {
  return mockWorkflows.filter((w) => w.status === status);
};

// ID로 워크플로우 찾기
export const getWorkflowById = (id: number) => {
  return mockWorkflows.find((w) => w.id === id);
};
