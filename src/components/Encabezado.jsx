
import {   Navbar,  Nav,  Container, Button,   Badge, Form, FormControl
} from 'react-bootstrap'
import { Link, NavLink, useNavigate } from 'react-router-dom'

const logo = '/imagenes/logo/Nova-Games-logo.png'

function Encabezado({
    cantidad,
    onVerCarrito,
    busqueda,
    onCambiarBusqueda,
    onBuscar,
    sesion,
    onLogout
}) {
    const navigate = useNavigate()

    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark" expand="lg" sticky="top">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img
                            src={logo}
                            alt="Nova Games"
                            width="65"
                            height="45"
                            className="me-2"
                        />
                        Nova entertainment
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="menu-principal" />

                    <Navbar.Collapse id="menu-principal">
                        <Nav className="me-auto">
                            <Nav.Link as={NavLink} to="/" end>Inicio</Nav.Link>
                            <Nav.Link as={NavLink} to="/productos">Productos</Nav.Link>
                            <Nav.Link as={NavLink} to="/comunidad">Comunidad</Nav.Link>
                            <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
                            <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
                            {sesion?.user?.role === 'ADMIN' && (
                                <Nav.Link as={NavLink} to="/admin">Administración</Nav.Link>
                            )}
                        </Nav>

                        <Nav className="me-3">
                            {sesion ? (
                                <>
                                    <Navbar.Text className="me-2">
                                        Hola, {sesion.user.username}
                                    </Navbar.Text>
                                    <Button
                                        variant="outline-light"
                                        size="sm"
                                        onClick={onLogout}
                                    >
                                        Cerrar sesión
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={NavLink} to="/registro">Registrarse</Nav.Link>
                                    <Nav.Link as={NavLink} to="/login">Iniciar sesión</Nav.Link>
                                </>
                            )}
                        </Nav>

                        <Button
                            variant="outline-light"
                            onClick={onVerCarrito}
                        >
                            🛒 <Badge bg="light" text="dark">{cantidad}</Badge>
                        </Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="py-3">
                <Form
                    className="d-flex gap-2"
                    onSubmit={(e) => {
                        e.preventDefault()
                        onBuscar()
                        navigate('/productos')
                    }}
                >
                    <FormControl
                        type="search"
                        placeholder="Buscar un juego..."
                        aria-label="Buscar un juego"
                        value={busqueda}
                        onChange={(e) => onCambiarBusqueda(e.target.value)}
                    />

                    <Button type="submit" variant="primary">
                        Buscar
                    </Button>
                </Form>
            </Container>
        </>
    )
}

export default Encabezado
