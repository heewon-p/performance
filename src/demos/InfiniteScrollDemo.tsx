import styled from "styled-components";

const InfiniteScrollDemo = () => {
  return (
    <Container>
      <VideoWrapper>
        <StyledVideo
          src="/videos/infiniteScroll.mov"
          // autoPlay
          loop
          muted
          playsInline
          controls
        />
      </VideoWrapper>
      <Description>
        <h2>🔄 AIDO 프로젝트 실제 적용 사례</h2>
        <p>
          영상 설명
          <br />• 페이지 진입하였을 때 모든 데이터를 로드 하는 것이 아니라,
          스크롤에 따라 필요한 데이터만 로드 하는 것을 확인할 수 있습니다.
        </p>
        <p>
          스크롤에 따라 네트워크 탭에서 API가 효율적으로 호출되는 것을 확인할 수
          있습니다.
        </p>
      </Description>

      <SummaryCard>
        <SummaryTitle>📊 무한 스크롤(Infinite Scroll)의 효과</SummaryTitle>

        <SummaryText>
          무한 스크롤을 구현하면 사용자가 스크롤할 때만 필요한 데이터를 로드하여
          초기 로딩 시간을 대폭 단축하고 네트워크 리소스를 효율적으로 사용할 수
          있습니다.
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
      </SummaryCard>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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

const SummaryText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  opacity: 0.95;
  margin-top: 15px;
`;
const VideoWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const StyledVideo = styled.video`
  width: 100%;
  height: auto;
  display: block;
`;

const Description = styled.div`
  margin-top: 20px;
  text-align: center;

  h2 {
    color: #6b7c93;
    margin-bottom: 10px;
  }

  p {
    color: #666;
    font-size: 1rem;
  }
`;

export default InfiniteScrollDemo;
