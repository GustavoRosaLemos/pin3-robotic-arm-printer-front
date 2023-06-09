import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { Button, Col, Container, ProgressBar, Row } from 'react-bootstrap';
import Background from '../../shared/images/background.png';
import {
  useGetImage,
  useImage,
  useMatrixData,
} from '../../store/hooks/renderHooks';
import Loading from '../../shared/components/Loading';
import { formatRemainingTime, saveJSONInFile } from '../../utils';

function RenderPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [render, setRender] = useState(0);
  const image = useImage();
  const matrixData = useMatrixData();
  const getImage = useGetImage();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchImage = async () => {
      setIsLoading(true);
      try {
        if (!matrixData) {
          throw Error('Não foi possível localizar os dados da imagem.');
        }
        if (!image || matrixData.matrix !== image.matrix) {
          await getImage(matrixData);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    fetchImage();
  }, [getImage]);

  useEffect(() => {
    if (image && image.matrix && !isLoading) {
      renderImageFromMatrix(image.matrix, image.matrixOrder);
    }
  }, [image, canvasRef.current, isLoading, render]);

  function renderImageFromMatrix(matrix: number[][], renderMatrix: number[][]) {
    const rows = matrix.length;
    const cols = matrix[0].length;

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    canvas.width = cols;
    canvas.height = rows;

    const ctx = canvas.getContext('2d');

    // eslint-disable-next-line no-plusplus
    for (let row = 0; row < rows; row++) {
      // eslint-disable-next-line no-plusplus
      for (let col = 0; col < cols; col++) {
        const value = matrix[row][col];
        const position = renderMatrix[row][col];

        if (position > render) {
          const r = 0;
          // eslint-disable-next-line no-bitwise
          const g = 0;
          // eslint-disable-next-line no-bitwise
          const b = 0;
          // eslint-disable-next-line no-bitwise
          const a = 0;
          if (ctx) {
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
            ctx.fillRect(col, row, 1, 1);
          }
        } else {
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
    }
    if (render <= matrix[0].length * matrix.length) {
      setRender((n) => n + 1);
    }
  }

  const handleCancelSimulation = () => {
    toast.success('Simulação cancelada com sucesso!');
    navigate('/');
  };

  const handleSaveSimulation = () => {
    if (image) {
      saveJSONInFile(image, 'Resultados');
      toast.success('Download dos resultados realizado com sucesso!');
    }
  };

  const handleResetRender = () => {
    setRender(0);
  };

  const handleSkipRender = () => {
    if (image) {
      setRender(image.matrix.length * image.matrix[0].length);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container
      className="noGutters pb-5 d-flex align-item-center justify-content-center"
      fluid
      style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${Background})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        overflow: 'hidden',
      }}
    >
      <canvas ref={canvasRef} />
      <Row
        className="d-flex align-items-center justify-content-around"
        style={{
          position: 'absolute',
          zIndex: '1',
          bottom: '0',
          width: '100vw',
          height: '60px',
        }}
      >
        <Col className="col-auto">
          <Button variant="danger" onClick={handleCancelSimulation}>
            Cancelar
          </Button>
        </Col>
        {image && (
          <>
            <Col className="col-auto">
              <Button variant="success" onClick={handleSaveSimulation}>
                Salvar
              </Button>
            </Col>
            <Col className="col-auto">
              <Button variant="secondary" onClick={handleResetRender}>
                Reiniciar
              </Button>
            </Col>
            <Col className="col-auto">
              <Button variant="secondary" onClick={handleSkipRender}>
                Pular
              </Button>
            </Col>
            <Col className="d-flex mr-3 justify-content-end">
              <ProgressBar
                className="noGutters"
                animated
                now={100}
                label={`Tempo estimado ${formatRemainingTime(image.time)}`}
                style={{ height: '33px', width: '900px' }}
              />
            </Col>
          </>
        )}
      </Row>
    </Container>
  );
}

export default RenderPage;
