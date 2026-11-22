import { Container, Row, Col, Badge, Button, Alert } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { useProducto } from '../hooks/useProducto.js'

function ProductoDetallePage({ onAgregarProducto }) {
    const { id } = useParams()
    const { producto, cargando, error } = useProducto(id)

    return (
        <Container className="py-4" id="detalle-producto">
            <Link to="/productos" className="d-inline-block mb-3">
                ← Volver al catálogo
            </Link>

            {cargando && <p>Cargando producto...</p>}
            {error && <Alert variant="danger">{error}</Alert>}

            {!cargando && !error && producto && (
                <Row className="g-4">
                    <Col xs={12} md={6}>
                        <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="detalle-imagen"
                        />
                    </Col>

                    <Col xs={12} md={6}>
                        <Badge bg="secondary" className="mb-2">
                            {producto.categoria}
                        </Badge>

                        <h1 className="h2">{producto.nombre}</h1>

                        <p className="fs-3 fw-semibold">
                            ${producto.precio.toLocaleString('es-CL')}
                        </p>

                        <p className={producto.stock === 0 ? 'text-danger' : 'text-success'}>
                            {producto.stock === 0
                                ? 'Sin stock'
                                : `Quedan ${producto.stock} unidades`}
                        </p>

                        <h2 className="h5">Plataformas</h2>
                        <div className="d-flex gap-2 flex-wrap mb-3">
                            {producto.plataformas.map(plataforma => (
                                <Badge key={plataforma} bg="secondary">
                                    {plataforma}
                                </Badge>
                            ))}
                        </div>

                        <h2 className="h5">Descripción</h2>
                        <p>{producto.descripcion}</p>

                        <Button
                            variant="primary"
                            onClick={() => onAgregarProducto(producto)}
                            disabled={producto.stock === 0}
                        >
                            Agregar al carrito
                        </Button>
                    </Col>
                </Row>
            )}
        </Container>
    )
}

export default ProductoDetallePage
