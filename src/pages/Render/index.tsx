import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { Container } from 'react-bootstrap';
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
  // eslint-disable-next-line no-unused-vars
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
          // navigate('/');
        } finally {
          hideLoading();
        }
      }
    };
    fetchImageData();
  }, []);

  useEffect(() => {
    if (matrixData && matrixData.matrix) {
      renderImageFromMatrix(matrixData?.matrix);
    }
  }, [matrixData, canvasRef.current]);

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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container
      className="d-flex alig-item-center justify-content-center"
      fluid
      style={{ width: '100vw', height: '100vh' }}
    >
      <Render>
        <canvas ref={canvasRef} />
      </Render>
    </Container>
  );
}

export default RenderPage;
