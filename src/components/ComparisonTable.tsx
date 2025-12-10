import styled from "styled-components";
import { motion } from "framer-motion";

interface ComparisonRow {
  metric: string;
  before: string;
  after: string;
  improvement: string;
}

interface ComparisonTableProps {
  data?: ComparisonRow[];
}

const defaultData: ComparisonRow[] = [
  {
    metric: "초기 로딩 속도",
    before: "2.8초",
    after: "0.3초",
    improvement: "89% ↓",
  },
  {
    metric: "API 호출 횟수",
    before: "15회",
    after: "3회",
    improvement: "80% ↓",
  },
  {
    metric: "리렌더링 횟수",
    before: "45회",
    after: "8회",
    improvement: "82% ↓",
  },
  {
    metric: "메모리 사용량",
    before: "48MB",
    after: "12MB",
    improvement: "75% ↓",
  },
];

const ComparisonTable = ({ data = defaultData }: ComparisonTableProps) => {
  return (
    <TableContainer>
      <TableTitle>📈 최적화 성과 요약</TableTitle>
      <Table>
        <thead>
          <tr>
            <Th>측정 항목</Th>
            <Th>최적화 전</Th>
            <Th>최적화 후</Th>
            <Th>개선율</Th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <TableRow
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Td>{row.metric}</Td>
              <TdBefore>{row.before}</TdBefore>
              <TdAfter>{row.after}</TdAfter>
              <TdImprovement>{row.improvement}</TdImprovement>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

const TableContainer = styled.div`
  margin-top: 30px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const TableTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 15px;
  text-align: left;
  background: linear-gradient(135deg, #8b9aaf 0%, #6b7c93 100%);
  color: white;
  font-weight: bold;
  font-size: 1rem;

  &:first-child {
    border-top-left-radius: 10px;
  }

  &:last-child {
    border-top-right-radius: 10px;
  }
`;

const TableRow = styled(motion.tr)`
  border-bottom: 1px solid #e0e0e0;
  transition: background 0.3s ease;

  &:hover {
    background: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Td = styled.td`
  padding: 15px;
  color: #333;
  font-weight: 500;
`;

const TdBefore = styled.td`
  padding: 15px;
  color: #ff6b6b;
  font-weight: bold;
`;

const TdAfter = styled.td`
  padding: 15px;
  color: #51cf66;
  font-weight: bold;
`;

const TdImprovement = styled.td`
  padding: 15px;
  color: #6b7c93;
  font-weight: bold;
  font-size: 1.1rem;
`;

export default ComparisonTable;
