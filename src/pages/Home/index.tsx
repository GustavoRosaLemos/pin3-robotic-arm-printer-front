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
import { useNavigate } from 'react-router';
import Select from 'react-select';
import { object, array, number } from 'yup';
import InfoSquare from '../../shared/components/InfoSquare';
import InitialScale from '../../shared/animations/InitialScale';
import ConfigurationModal from '../../shared/components/ConfigurationModal';
import { Configuration, Options } from '../../shared/@types';
import FileButton from '../../shared/components/FileButton';
import ImageDragAndDrop from '../../shared/components/ImageDragAndDrop';
import { reduceImageColors } from '../../utils/colorReduce';
import { useGetMatrixData } from '../../store/hooks/renderHooks';
import { delay, resizeFile } from '../../utils';
import { ALGORITHM } from '../../shared/constants';

interface HomePageProps {
  // eslint-disable-next-line react/require-default-props
  className?: string;
}

function HomePage({ className }: HomePageProps) {
  const [showConfigurationModal, setShowConfigurationModal] = useState(false);
  const getMatrix = useGetMatrixData();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const loadingToastRef = useRef<Id | undefined>();

  const formInitialsValues: Configuration = {
    algorithm: ['2'],
    colorChangeDelay: 3,
    files: null,
    moveDelay: 5,
    imageMaxSize: 100,
    renderQuantity: 1,
  };

  const formik = useFormik({
    initialValues: formInitialsValues,
    onSubmit: (values) => {
      try {
        handleSubmitForm(values);
      } catch (error) {
        if (error instanceof Error) {
          toast(error.message);
        }
      }
    },
    enableReinitialize: true,
    validationSchema: object().shape({
      algorithm: array()
        .required('Campo obrigatório.')
        .min(1, 'Selecione um algoritmo'),
      colorChangeDelay: number()
        .required('Campo obrigatório.')
        .min(0.1, 'Deve ser maior que 0.1'),
      moveDelay: number()
        .required('Campo obrigatório.')
        .min(0.1, 'Deve ser maior que 0.1'),
      imageMaxSize: number()
        .required('Campo obrigatório.')
        .min(10, 'Deve ser maior que 10'),
      renderQuantity: number()
        .required('Campo obrigatório.')
        .min(1, 'Deve ser maior que 1'),
    }),
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

    loadingToastRef.current = toast.loading('Convertendo a imagem...');

    try {
      const { algorithm, colorChangeDelay, moveDelay, renderQuantity } = values;
      const matrix = await handleConvertImageToMatrix(
        formValues.files[0],
        formValues.imageMaxSize
      );
      await delay(1000);
      getMatrix({
        matrix,
        algorithm,
        timeChange: colorChangeDelay,
        timeMove: moveDelay,
        renderQuantity,
      });
      toast.update(loadingToastRef.current, {
        render: 'Imagem convertida com sucesso!',
        type: 'success',
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
      if (formValues.algorithm.length > 1 || formValues.renderQuantity > 1) {
        navigate('/multi-render');
      } else {
        navigate('/render');
      }
    } catch (error) {
      toast.update(loadingToastRef.current, {
        render: 'Falha ao converter imagem!',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    }
  };

  const handleConvertImageToMatrix = async (image: Blob, maxSize: number) => {
    const imageReader = new FileReader();
    const matrix: number[][] = [];
    imageReader.readAsDataURL((await resizeFile(image, maxSize)) as Blob);
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

  // eslint-disable-next-line no-unused-vars
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
        overflow: 'hidden',
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
          <Row className="mt-3">
            <Col md={6}>
              <InitialScale delay={0.2}>
                <Form.Group>
                  <Form.Label>Algoritmo</Form.Label>
                  <Select
                    placeholder="Selecione"
                    isMulti
                    name="algorithm"
                    options={ALGORITHM}
                    value={
                      values.algorithm.map((value) => {
                        const find = ALGORITHM.find(
                          (algorithm) => algorithm.value === value
                        );
                        return find;
                      }) as unknown as Options
                    }
                    onChange={(options) => {
                      setFieldValue(
                        'algorithm',
                        options.map((option) => option.value)
                      );
                    }}
                  />
                  {touched.algorithm && errors.algorithm && (
                    <Form.Text className="error">{errors.algorithm}</Form.Text>
                  )}
                </Form.Group>
              </InitialScale>
            </Col>
            <Col>
              <InitialScale delay={0.2}>
                <Form.Group>
                  <Form.Label>Número de execuções</Form.Label>
                  <Form.Control
                    className="d-flex"
                    type="number"
                    name="renderQuantity"
                    onChange={handleChange}
                    value={values.renderQuantity}
                  />
                  {touched.renderQuantity && errors.renderQuantity && (
                    <Form.Text className="error">
                      {errors.renderQuantity}
                    </Form.Text>
                  )}
                </Form.Group>
              </InitialScale>
            </Col>
            <Col>
              <InitialScale delay={0.3}>
                <Form.Group>
                  <Form.Label>Tamanho max imagem</Form.Label>
                  <Form.Control
                    className="d-flex"
                    type="number"
                    name="imageMaxSize"
                    onChange={handleChange}
                    value={values.imageMaxSize}
                  />
                  {touched.imageMaxSize && errors.imageMaxSize && (
                    <Form.Text className="error">
                      {errors.imageMaxSize}
                    </Form.Text>
                  )}
                </Form.Group>
              </InitialScale>
            </Col>
            <Col>
              <InitialScale delay={0.4}>
                <Form.Group>
                  <Form.Label>Tempo de troca da cor</Form.Label>
                  <Form.Control
                    className="d-flex"
                    type="number"
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
            </Col>
            <Col>
              <InitialScale delay={0.5}>
                <Form.Group>
                  <Form.Label>Tempo de movimento</Form.Label>
                  <Form.Control
                    className="d-flex"
                    type="number"
                    name="moveDelay"
                    onChange={handleChange}
                    value={values.moveDelay}
                  />
                  {touched.moveDelay && errors.moveDelay && (
                    <Form.Text className="error">{errors.moveDelay}</Form.Text>
                  )}
                </Form.Group>
              </InitialScale>
            </Col>
          </Row>
          <Row className="mt-5 pt-3 justify-content-end border-top">
            <InitialScale delay={0.5}>
              <Button variant="danger" onClick={handleCloseModal}>
                Cancelar
              </Button>
            </InitialScale>
            <InitialScale delay={0.5}>
              <Button type="submit">Iniciar Simulação</Button>
            </InitialScale>
          </Row>
        </Form>
      </ConfigurationModal>
    </Container>
  );
}

export default HomePage;
