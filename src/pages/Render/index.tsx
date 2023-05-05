import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { Button, Col, Container, ProgressBar, Row } from 'react-bootstrap';
import {
  useGetImage,
  useImage,
  useMatrixData,
} from '../../store/hooks/renderHooks';
import Loading from '../../shared/components/Loading';
import {
  useHideLoading,
  useLoading,
  useShowLoading,
} from '../../store/hooks/loadingHooks';
import Render from '../../shared/animations/Render';

function RenderPage() {
  const isLoading = useLoading();
  const image = useImage();
  const matrixData = useMatrixData();
  const showLoading = useShowLoading();
  const hideLoading = useHideLoading();
  const getImage = useGetImage();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchImageData = async () => {
      showLoading();
      if (!matrixData) {
        toast.error('Não foi possível localizar os dados da imagem!');
        hideLoading();
        navigate('/');
      } else {
        try {
          await getImage(matrixData);
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
          }
          navigate('/');
        } finally {
          hideLoading();
        }
      }
    };
    fetchImageData();
  }, []);

  useEffect(() => {
    if (image && image.matrix) {
      renderImageFromMatrix(image.matrix);
    }
  }, [image, canvasRef.current]);

  function renderImageFromMatrix(matrix: number[][]) {
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

  const handleCancelSimulation = () => {
    toast.success('Simulação cancelada com sucesso!');
    navigate('/');
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
        backgroundColor: 'grey',
        overflow: 'hidden',
      }}
    >
      <Render>
        <canvas ref={canvasRef} />
      </Render>
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
            Cancelar Simulação
          </Button>
        </Col>
        {image && (
          <>
            <Col className="col-auto" style={{ color: 'white' }}>
              Movimentos: {image?.moves}
            </Col>
            <Col className="col-auto" style={{ color: 'white' }}>
              Mudanças de cor: {image?.colorChanges}
            </Col>
          </>
        )}
        <Col className="d-flex mr-3 justify-content-end">
          {image && image?.time && (
            <ProgressBar
              className="noGutters"
              animated
              now={100}
              label={`Tempo estimado ${image.time} segundos...`}
              style={{ height: '33px', width: '900px' }}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default RenderPage;
