import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DragEventHandler } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import styled from 'styled-components';

interface FileButtonProps {
  onClick: () => void;
  // eslint-disable-next-line react/require-default-props
  onDragOver?: DragEventHandler<HTMLButtonElement>;
  // eslint-disable-next-line react/require-default-props
  onDrop?: DragEventHandler<HTMLButtonElement>;
  text: string;
  icon: IconDefinition;
  color: string;
  hoverColor: string;
  iconSize: SizeProp;
  // eslint-disable-next-line react/require-default-props
  className?: string;
}

function FileButton({
  onClick,
  text,
  icon,
  // eslint-disable-next-line no-unused-vars
  color,
  // eslint-disable-next-line no-unused-vars
  hoverColor,
  iconSize,
  className,
  onDragOver,
  onDrop,
}: FileButtonProps) {
  return (
    <Button
      className={className}
      variant="none"
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <Col className="d-flex flex-column align-items-center justify-content-center p-3">
        <Row className="justify-content-center">
          <FontAwesomeIcon
            className="uploadImage"
            icon={icon}
            size={iconSize}
          />
        </Row>
        <Row className="mt-3 uploadText" style={{ textAlign: 'center' }}>
          {text}
        </Row>
      </Col>
    </Button>
  );
}

export default styled(FileButton)`
  color: ${(props) => props.color};
  border: 1px solid ${(props) => props.color};
  .uploadText {
    color: ${(props) => props.color};
  }
  .uploadImage {
    color: ${(props) => props.color};
  }
  :hover {
    background-color: ${(props) => props.color};
    .uploadText {
      color: ${(props) => props.hoverColor};
    }
    .uploadImage {
      color: ${(props) => props.hoverColor};
    }
  }
`;
