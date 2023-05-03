import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import {
  faArrowAltCircleRight,
  faCog,
  faPaintBrush,
  faPrint,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import { useFormik } from 'formik';
import { toast, Id } from 'react-toastify';
import InfoSquare from '../../shared/components/InfoSquare';
import InitialScale from '../../shared/animations/InitialScale';
import ConfigurationModal from '../../shared/components/ConfigurationModal';
import { Configuration } from '../../shared/@types';
import FileButton from '../../shared/components/FileButton';
import ImageDragAndDrop from '../../shared/components/ImageDragAndDrop';
import { reduceImageColors } from '../../utils/colorReduce';

interface HomePageProps {
  // eslint-disable-next-line react/require-default-props
  className?: string;
}

function HomePage({ className }: HomePageProps) {
  const [showConfigurationModal, setShowConfigurationModal] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // eslint-disable-next-line no-unused-vars
  const loadingToastRef = useRef<Id | undefined>();

  const formInitialsValues: Configuration = {
    algorithm: '',
    colorChangeDelay: 3,
    files: null,
    moveDelay: 0,
  };

  const formik = useFormik({
    initialValues: formInitialsValues,
    onSubmit: (values) => {
      console.log('enviado!');
      try {
        handleSubmitForm(values);
      } catch (error) {
        if (error instanceof Error) {
          toast(error.message);
        }
      }
    },
    enableReinitialize: true,
  });
  // eslint-disable-next-line no-empty-pattern, no-unused-vars
  const {
    values,
    handleChange,
    setFieldValue,
    handleReset,
    handleSubmit,
    touched,
    errors,
  } = formik;

  const handleSubmitForm = async (formValues: Configuration) => {
    if (!formValues.files) {
      toast.error('É necessário enviar a imagem para iniciar a simulação.');
      return;
    }

    const matrix = handleConvertImageToMatrix(formValues.files[0]);
    toast.promise(matrix, {
      pending: 'Convertendo imagem...',
      error: 'Falha ao converter imagem',
      success: 'Imagem convertida com sucesso!',
    });

    function delay(ms: number) {
      // eslint-disable-next-line no-promise-executor-return
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    await delay(3000);

    const matrixData = await matrix;

    downloadImageFromMatrix(await matrix);

    console.log(matrixData);
  };

  const handleConvertImageToMatrix = async (image: Blob) => {
    const imageReader = new FileReader();
    const matrix: number[][] = [];
    imageReader.readAsDataURL(image);
    imageReader.onload = () => {
      const img = new Image();
      img.src = imageReader.result?.toString() ?? '';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0, img.width, img.height);

        if (ctx) {
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const pixelData = reduceImageColors(imageData).newImageData.data;
          const rows = img.height;
          const cols = img.width;

          // eslint-disable-next-line no-plusplus
          for (let row = 0; row < rows; row++) {
            matrix[row] = [];

            // eslint-disable-next-line no-plusplus
            for (let col = 0; col < cols; col++) {
              const offset = (row * cols + col) * 4;

              const r = pixelData[offset];
              const g = pixelData[offset + 1];
              const b = pixelData[offset + 2];
              const a = pixelData[offset + 3];

              // eslint-disable-next-line no-bitwise
              const value = (a << 24) | (r << 16) | (g << 8) | b;

              matrix[row][col] = value;
            }
          }
        }
      };
    };
    return matrix;
  };

  function downloadImageFromMatrix(matrix: number[][]) {
    const rows = matrix.length;
    const cols = matrix[0].length;

    const canvas = document.createElement('canvas');
    canvas.width = cols;
    canvas.height = rows;

    const ctx = canvas.getContext('2d');

    // eslint-disable-next-line no-plusplus
    for (let row = 0; row < rows; row++) {
      // eslint-disable-next-line no-plusplus
      for (let col = 0; col < cols; col++) {
        const value = matrix[row][col];

        // eslint-disable-next-line no-bitwise
        const r = (value >> 16) & 0xff;
        // eslint-disable-next-line no-bitwise
        const g = (value >> 8) & 0xff;
        // eslint-disable-next-line no-bitwise
        const b = value & 0xff;
        // eslint-disable-next-line no-bitwise
        const a = (value >> 24) & 0xff;

        if (ctx) {
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
          ctx.fillRect(col, row, 1, 1);
        }
      }
    }

    const dataURL = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleSetFile = (files: FileList | null) => {
    if (
      !files ||
      (files[0].type !== 'image/png' && files[0].type !== 'image/jpg')
    ) {
      toast('Arquivo inválido!', { type: 'error' });
      return;
    }
    console.log(files);
    setFieldValue('files', files);
  };

  const handleCloseModal = () => {
    handleReset(true);
    setShowConfigurationModal(false);
  };

  return (
    <Container
      className={className}
      fluid
      style={{
        backgroundColor: '#394867',
        height: '100vh',
        width: '100vw',
        position: 'static',
      }}
    >
      <Row className="justify-content-center">
        <InitialScale delay={0}>
          <Col
            className="mt-3 d-flex flex-column align-items-center"
            style={{ width: '100vw' }}
          >
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
          <InitialScale delay={0.6}>
            <Row className="col-auto">
              <FileButton
                onClick={() => setShowConfigurationModal(true)}
                icon={faUpload}
                text="Envie a imagem que deseja simular a impressão."
                color="white"
                hoverColor="#394867"
                iconSize="5x"
              />
            </Row>
          </InitialScale>
        </Row>
      </Row>
      <ConfigurationModal
        title="Configurações da simulação"
        show={showConfigurationModal}
        handleClose={handleCloseModal}
      >
        <Form onSubmit={handleSubmit}>
          <Row className="noGutters title">
            Selecione as configurações da simulação.
          </Row>
          <Row className="mt-3 justify-content-center">
            <input
              type="file"
              hidden
              onChange={(event) => handleSetFile(event.target.files)}
              ref={inputRef}
            />
            <ImageDragAndDrop
              onClick={() => inputRef.current?.click()}
              files={values.files}
            />
          </Row>
          <Row className="mt-3 justify-content-between">
            <Row className="col-auto">
              <InitialScale delay={0.2}>
                <Form.Group>
                  <Form.Label>Algoritmo</Form.Label>
                  <Form.Select aria-label="Algoritmo">
                    <option>Selecione o algoritmo</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Select>
                </Form.Group>
              </InitialScale>
            </Row>
            <Row className="col-auto">
              <InitialScale delay={0.2}>
                <Form.Group>
                  <Form.Label>Tempo de troca da cor</Form.Label>
                  <Form.Control
                    className="d-flex"
                    type="number"
                    placeholder="3 segundos"
                    name="colorChangeDelay"
                    onChange={handleChange}
                    value={values.colorChangeDelay}
                  />
                  {touched.colorChangeDelay && errors.colorChangeDelay && (
                    <Form.Text className="error">
                      {errors.colorChangeDelay}
                    </Form.Text>
                  )}
                </Form.Group>
              </InitialScale>
            </Row>
            <Row className="col-auto">
              <InitialScale delay={0.2}>
                <Form.Group>
                  <Form.Label>Tempo de movimento</Form.Label>
                  <Form.Control
                    className="d-flex"
                    type="number"
                    placeholder="1x"
                  />
                </Form.Group>
              </InitialScale>
            </Row>
          </Row>
          <Row className="mt-5 pt-3 justify-content-end border-top">
            <InitialScale delay={0.3}>
              <Button variant="danger" onClick={handleCloseModal}>
                Cancelar
              </Button>
            </InitialScale>
            <InitialScale delay={0.3}>
              <Button type="submit">Iniciar Simulação</Button>
            </InitialScale>
          </Row>
        </Form>
      </ConfigurationModal>
    </Container>
  );
}

export default HomePage;
