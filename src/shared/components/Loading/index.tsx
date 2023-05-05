import { Container } from 'react-bootstrap';
// eslint-disable import/no-extraneous-dependencies
import ReactLoading from 'react-loading';

function Loading() {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      fluid
      style={{
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        overflow: 'hidden',
        backgroundColor: 'grey',
      }}
    >
      <ReactLoading type="spin" color="#394867" height="5%" width="5%" />
    </Container>
  );
}

export default Loading;
