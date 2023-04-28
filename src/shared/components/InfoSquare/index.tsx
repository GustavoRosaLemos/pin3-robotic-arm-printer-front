import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'react-bootstrap';

interface InfoSquareProps {
  text: string;
  image: IconDefinition;
  size: SizeProp;
  color: string;
  width: string;
  height: string;
  backgroundColor: string;
  border: string;
}

function InfoSquare({
  text,
  image,
  size,
  color,
  width,
  height,
  backgroundColor,
  border,
}: InfoSquareProps) {
  return (
    <Col
      className="d-flex flex-column align-items-center justify-content-center"
      style={{
        backgroundColor,
        width,
        height,
        borderRadius: '5px',
        boxShadow: '0px 4px 4px 0px #00000040',
        border,
      }}
    >
      <Row className="justify-content-center">
        <FontAwesomeIcon icon={image} size={size} color={color} />
      </Row>
      <Row
        className="mt-1 justify-content-center"
        style={{ textAlign: 'center', color }}
      >
        {text}
      </Row>
    </Col>
  );
}

export default InfoSquare;
