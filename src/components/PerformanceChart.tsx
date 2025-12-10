import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import styled from "styled-components";

interface PerformanceChartProps {
  beforeData: {
    calls: number;
    totalTime: number;
    cacheHits?: number;
  };
  afterData: {
    calls: number;
    totalTime: number;
    cacheHits?: number;
  };
  type?: "line" | "bar";
}

const PerformanceChart = ({
  beforeData,
  afterData,
  type = "bar",
}: PerformanceChartProps) => {
  const chartData = [
    {
      name: "최적화 전",
      "평균 응답시간 (ms)":
        beforeData.calls > 0
          ? Math.round(beforeData.totalTime / beforeData.calls)
          : 0,
      "API 호출 수": beforeData.calls,
      "캐시 히트": beforeData.cacheHits || 0,
    },
    {
      name: "최적화 후",
      "평균 응답시간 (ms)":
        afterData.calls > 0
          ? Math.round(afterData.totalTime / afterData.calls)
          : 0,
      "API 호출 수": afterData.calls,
      "캐시 히트": afterData.cacheHits || 0,
    },
  ];

  const improvement =
    beforeData.calls > 0 && afterData.calls > 0
      ? Math.round(
          ((beforeData.totalTime / beforeData.calls -
            afterData.totalTime / afterData.calls) /
            (beforeData.totalTime / beforeData.calls)) *
            100
        )
      : 0;

  return (
    <ChartContainer>
      <ChartTitle>📊 성능 비교 차트</ChartTitle>
      <ResponsiveContainer width="100%" height={300}>
        {type === "line" ? (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="평균 응답시간 (ms)"
              stroke="#ff6b6b"
              strokeWidth={3}
            />
          </LineChart>
        ) : (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="평균 응답시간 (ms)" fill="#ff6b6b" />
            <Bar dataKey="캐시 히트" fill="#51cf66" />
          </BarChart>
        )}
      </ResponsiveContainer>

      {improvement > 0 && (
        <ImprovementBadge>
          🚀 <strong>{improvement}% 속도 개선</strong>
        </ImprovementBadge>
      )}
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-top: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
`;

const ImprovementBadge = styled.div`
  text-align: center;
  margin-top: 20px;
  padding: 15px;
  background: linear-gradient(135deg, #51cf66 0%, #37b24d 100%);
  border-radius: 10px;
  color: white;
  font-size: 1.2rem;

  strong {
    font-size: 1.4rem;
  }
`;

export default PerformanceChart;
