import { Row } from 'react-bootstrap';
import { faUpload, faImage } from '@fortawesome/free-solid-svg-icons';
import FileButton from '../FileButton';
import InitialScale from '../../animations/InitialScale';

interface ImageDragAndDropProps {
  files: FileList | null;
  onClick: () => void;
}

function ImageDragAndDrop({ files, onClick }: ImageDragAndDropProps) {
  // eslint-disable-next-line no-unused-vars

  return (
    <InitialScale delay={0}>
      <Row className="dropzone" style={{ width: '300px' }}>
        <FileButton
          icon={files ? faImage : faUpload}
          onClick={onClick}
          text={
            files
              ? files[0].name ?? ''
              : 'Envie a imagem que deseja simular a impressão.'
          }
          color="#394867"
          hoverColor="white"
          iconSize="3x"
        />
      </Row>
    </InitialScale>
  );
}

export default ImageDragAndDrop;
