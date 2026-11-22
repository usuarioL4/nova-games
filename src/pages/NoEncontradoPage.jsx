import { Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function NoEncontradoPage() {
    return (
        <Container className="py-5 text-center">
            <h2>Página no encontrada</h2>
            <p>La dirección que buscas no existe.</p>
            <Button as={Link} to="/" variant="primary">
                Volver al inicio
            </Button>
        </Container>
    )
}

export default NoEncontradoPage
