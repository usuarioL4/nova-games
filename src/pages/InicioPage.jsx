import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import TarjetaProducto from '../components/TarjetaProducto.jsx'

const destacadas = [
    { titulo: 'Aventuras medievales', imagen: '/imagenes/game/game-image(1).png', categoria: 'Aventura' },
    { titulo: 'Carreras', imagen: '/imagenes/game/HYnDUL.png', categoria: 'Carreras' },
    { titulo: 'Shooter FPS', imagen: '/imagenes/game/772415.png', categoria: 'Shooter' },
    { titulo: 'Guerra táctica', imagen: '/imagenes/game/battlefield-background-r8xd4dc7f4a327ii.png', categoria: 'Acción' }
]

function InicioPage({ productos, cargando, error, onAgregarProducto, onSeleccionarCategoria }) {
    return (
        <>
            <section
                className="hero-inicio d-flex align-items-center"
                style={{ backgroundImage: "url('/imagenes/background/background-home.png')" }}
            >
                <Container className="py-5">
                    <h1 className="display-5 fw-bold">
                        Ya disponibles juegos para PlayStation, Xbox y PC
                    </h1>
                    <p className="lead">Disfruta de los mejores juegos y series de entretenimiento.</p>
                    <Button as={Link} to="/productos" variant="primary" size="lg">
                        Comprar ahora
                    </Button>
                </Container>
            </section>

            <Container className="py-5">
                <h2 className="mb-4">Categorías destacadas</h2>
                <Row xs={1} md={2} lg={4} className="g-4">
                    {destacadas.map(item => (
                        <Col key={item.titulo}>
                            <Card className="h-100">
                                <Card.Img variant="top" src={item.imagen} alt={item.titulo} />
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>{item.titulo}</Card.Title>
                                    <Button
                                        as={Link}
                                        to="/productos"
                                        variant="outline-secondary"
                                        className="mt-auto"
                                        onClick={() => onSeleccionarCategoria(item.categoria)}
                                    >
                                        Ver juegos
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            <Container className="pb-5">
                <h2 className="mb-4">Juegos destacados</h2>
                {cargando && <p>Cargando productos...</p>}
                {error && <Alert variant="danger">{error}</Alert>}

                {!cargando && !error && (
                    <Row xs={1} sm={2} lg={4} className="g-4">
                        {productos.slice(0, 4).map(producto => (
                            <Col key={producto.id}>
                                <TarjetaProducto
                                    producto={producto}
                                    onAgregarProducto={onAgregarProducto}
                                />
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>

            <Container className="pb-4">
                <Card className="p-4">
                    <h2>¿Qué es Nova?</h2>
                    <p className="mb-2">
                        Nova es una plataforma digital de videojuegos dedicada a reunir a jugadores y
                        desarrolladores a través de una gran biblioteca de juegos, lanzamientos
                        exclusivos y experiencias creadas por la comunidad.
                    </p>
                    <Link to="/nosotros">Conoce más aquí</Link>
                </Card>
            </Container>
        </>
    )
}

export default InicioPage
