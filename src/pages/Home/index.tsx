import { Button, Col, Container, Row } from 'react-bootstrap';
import {
  faArrowAltCircleRight,
  faCog,
  faPaintBrush,
  faPrint,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import InfoSquare from '../../shared/components/InfoSquare';
import InitialScale from '../../shared/animations/InitialScale';

interface HomePageProps {
  // eslint-disable-next-line react/require-default-props
  className?: string;
}

function HomePage({ className }: HomePageProps) {
  return (
    <Container
      className={className}
      fluid
      style={{ backgroundColor: '#394867', height: '100vh', width: '100vw' }}
    >
      <Row className="justify-content-center">
        <InitialScale delay={0}>
          <Col className="mt-3 d-flex flex-column col-auto align-items-center">
            <h1 style={{ fontSize: '50px', color: 'white' }}>
              RoboticArmPrinter
            </h1>
            <h2 style={{ fontSize: '12px', color: 'white' }}>
              Software de simulação de impressão para pintura em madeira
              utilizando braço robótico.
            </h2>
          </Col>
        </InitialScale>
        <Row
          className="mt-5 justify-content-around"
          style={{ width: '1200px' }}
        >
          <InitialScale delay={0.1}>
            <Row className="col-auto">
              <InfoSquare
                border="none"
                backgroundColor="white"
                size="3x"
                width="243px"
                height="124px"
                image={faPrint}
                color="#394867"
                text="Faça o upload da image que desejar."
              />
            </Row>
          </InitialScale>

          <InitialScale delay={0.2}>
            <Row className="col-auto align-items-center justify-content-center">
              <FontAwesomeIcon
                icon={faArrowAltCircleRight}
                size="4x"
                color="white"
              />
            </Row>
          </InitialScale>
          <InitialScale delay={0.3}>
            <Row className="col-auto">
              <InfoSquare
                border="none"
                backgroundColor="white"
                size="3x"
                width="243px"
                height="124px"
                image={faCog}
                color="#394867"
                text="Selecione as configurações da simulação."
              />
            </Row>
          </InitialScale>
          <InitialScale delay={0.4}>
            <Row className="col-auto align-items-center justify-content-center">
              <FontAwesomeIcon
                icon={faArrowAltCircleRight}
                size="4x"
                color="white"
              />
            </Row>
          </InitialScale>
          <InitialScale delay={0.5}>
            <Row className="col-auto">
              <InfoSquare
                border="none"
                backgroundColor="white"
                size="3x"
                width="243px"
                height="124px"
                image={faPaintBrush}
                color="#394867"
                text="Acompanhe a simulação da impressão em tempo real."
              />
            </Row>
          </InitialScale>
        </Row>
        <Row className="mt-5 justify-content-center">
          <Row className="col-auto">
            <Button
              variant="none"
              className="buttonWhite "
              style={{ border: '1px solid white' }}
            >
              <Col className="d-flex flex-column align-items-center justify-content-center p-3">
                <Row className="justify-content-center">
                  <FontAwesomeIcon
                    className="uploadImage"
                    icon={faUpload}
                    color="white"
                    size="5x"
                  />
                </Row>
                <Row
                  className="mt-3 uploadText"
                  style={{ textAlign: 'center' }}
                >
                  Envie a imagem que deseja simular a impressão.
                </Row>
              </Col>
            </Button>
          </Row>
        </Row>
      </Row>
    </Container>
  );
}

export default styled(HomePage)`
  .buttonWhite {
    color: white;
    :hover {
      background-color: white;
      .uploadImage {
        color: #394867;
      }
      .uploadText {
        color: #394867;
      }
    }
  }
`;
