import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import {
  useGetMultipleImage,
  useMatrixData,
  useMultipleImage,
} from '../../store/hooks/renderHooks';
import { formatRemainingTime, saveJSONInFile } from '../../utils';
import Loading from '../../shared/components/Loading';

function MultiRenderPage() {
  const [isLoading, setIsLoading] = useState(false);
  const getMultipleImage = useGetMultipleImage();
  const navigate = useNavigate();
  const matix = useMatrixData();
  const multipleImage = useMultipleImage();

  useEffect(() => {
    const fetchMultiImageData = async () => {
      if (!matix) {
        toast.error('Não foi possível encontrar os dados da imagem');
        navigate('/');
      } else {
        try {
          setIsLoading(true);
          await getMultipleImage(matix);
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
          }
          navigate('/');
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchMultiImageData();
  }, []);

  const handleClickReturn = () => {
    navigate('/');
  };

  const handleSaveSimulation = () => {
    if (multipleImage) {
      saveJSONInFile(multipleImage, 'Resultados');
      toast.success('Download dos resultados realizado com sucesso!');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container
      className="d-flex flex-column align-items-around"
      fluid
      style={{
        width: '100vw',
        height: '100vh',
      }}
    >
      <Row className="m-3 title">Renderização Múltipla</Row>
      <Row
        style={{
          flex: '1',
        }}
        className="m-3 d-flex justify-content-around"
      >
        {multipleImage?.map((image) => (
          <Card
            key={image.alg}
            className="m-3"
            style={{
              width: '18rem',
              boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
              borderColor: 'none',
            }}
          >
            <Card.Title className="mt-2">{image.alg}</Card.Title>
            <Card.Body>
              <Row>Tempo de movimento: {image.timeMove}</Row>
              <Row>tempo troca da cor: {image.timeChange}</Row>
              <Row>tempo estimado: {formatRemainingTime(image.time)}</Row>
            </Card.Body>
          </Card>
        ))}
      </Row>
      <Row className="m-3">
        <Col className="col-auto">
          <Button onClick={handleClickReturn} variant="danger">
            Voltar
          </Button>
        </Col>
        {multipleImage && (
          <Col className="col-auto">
            <Button variant="primary" onClick={handleSaveSimulation}>
              Salvar
            </Button>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default MultiRenderPage;
