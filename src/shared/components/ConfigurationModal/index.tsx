import { ReactNode } from 'react';
import Modal from 'react-bootstrap/Modal';

interface ConfigurationModalProps {
  title: ReactNode;
  children: ReactNode;
  // eslint-disable-next-line react/require-default-props
  footer?: ReactNode;
  show: boolean;
  // eslint-disable-next-line no-unused-vars
  handleClose: () => void;
}

function ConfigurationModal({
  title,
  children,
  footer,
  show,
  handleClose,
}: ConfigurationModalProps) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Modal show={show} onHide={handleClose} keyboard={false} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      {footer && <Modal.Footer>{footer}</Modal.Footer>}
    </Modal>
  );
}

export default ConfigurationModal;
