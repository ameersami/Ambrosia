import { default as styled } from 'styled-components';

const HomePageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden;
`;

const LeftColumnContainer = styled.div`
  background: blue;
  height: 100%;
  width: 30%;
  padding: 12px;
  box-sizing: border-box;
`;

const RightColumnContainer = styled.div`
  background: white;
  height: 100%;
  width: 90%;
  padding: 12px;
  box-sizing: border-box;
`;

export {
  HomePageContainer,
  LeftColumnContainer,
  RightColumnContainer
}