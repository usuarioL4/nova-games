
import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const logo = '/imagenes/logo/Nova-Games-logo.png'

function Pie() {
    return (
        <footer className="pie-pagina mt-5 py-4">
            <Container className="text-center">
                <img src={logo} alt="Nova Games" height="60" className="mb-3" />

                <div className="d-flex justify-content-center gap-3 flex-wrap mb-3">
                    <Link to="/contacto">Ayuda y comentarios</Link>
                    <Link to="/nosotros">Quiénes somos</Link>
                    <Link to="/comunidad">Comunidad</Link>
                </div>

                <p className="mb-0 small">
                    Todos los derechos reservados a @anonymous - 2026
                </p>
            </Container>
        </footer>
    )
}

export default Pie
