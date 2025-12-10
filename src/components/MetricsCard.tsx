import styled from "styled-components";
import { motion } from "framer-motion";

interface MetricsCardProps {
  label: string;
  value: string | number;
  color?: string;
  highlight?: boolean;
  icon?: string;
}

const MetricsCard = ({
  label,
  value,
  color = "#6b7c93",
  highlight = false,
  icon,
}: MetricsCardProps) => {
  return (
    <Card
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      $color={color}
      $highlight={highlight}
    >
      {icon && <Icon>{icon}</Icon>}
      <Value $highlight={highlight}>{value}</Value>
      <Label>{label}</Label>
    </Card>
  );
};

const Card = styled(motion.div)<{ $color: string; $highlight: boolean }>`
  background: ${(props) =>
    props.$highlight
      ? `linear-gradient(135deg, ${props.$color} 0%, ${props.$color}dd 100%)`
      : "white"};
  border: 2px solid ${(props) => props.$color};
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  box-shadow: ${(props) =>
    props.$highlight
      ? `0 8px 20px ${props.$color}44`
      : "0 2px 8px rgba(0,0,0,0.1)"};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${(props) =>
      props.$highlight
        ? `0 12px 24px ${props.$color}66`
        : "0 4px 12px rgba(0,0,0,0.15)"};
  }
`;

const Icon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 5px;
`;

const Value = styled.div<{ $highlight: boolean }>`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${(props) => (props.$highlight ? "white" : "#333")};
  margin-bottom: 5px;
`;

const Label = styled.div`
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
`;

export default MetricsCard;
