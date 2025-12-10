export interface History {
  id: number;
  workflowId: number;
  eventType: "success" | "warning" | "error";
  timestamp: string;
  duration: number;
  message: string;
  metadata: {
    nodeId?: string;
    zoneType?: string;
    [key: string]: any;
  };
}

// 100개의 히스토리 목데이터
export const mockHistories: History[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  workflowId: Math.floor(Math.random() * 50) + 1,
  eventType: ["success", "warning", "error"][Math.floor(Math.random() * 3)] as
    | "success"
    | "warning"
    | "error",
  timestamp: new Date(
    2024,
    10,
    1,
    Math.floor(i / 4),
    (i % 4) * 15
  ).toISOString(),
  duration: Math.floor(Math.random() * 5000) + 100,
  message: `이벤트 ${i + 1} 처리 완료`,
  metadata: {
    nodeId: `node-${Math.floor(Math.random() * 10) + 1}`,
    zoneType: ["detection", "tracking", "analytics"][
      Math.floor(Math.random() * 3)
    ],
  },
}));

// 워크플로우별 히스토리 조회
export const getHistoriesByWorkflowId = (workflowId: number) => {
  return mockHistories.filter((h) => h.workflowId === workflowId);
};

// 이벤트 타입별 히스토리 조회
export const getHistoriesByEventType = (eventType: History["eventType"]) => {
  return mockHistories.filter((h) => h.eventType === eventType);
};

// 페이지네이션된 히스토리 조회
export const getPaginatedHistories = (page: number = 1, limit: number = 20) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: mockHistories.slice(start, end),
    total: mockHistories.length,
    page,
    limit,
    hasMore: end < mockHistories.length,
  };
};
