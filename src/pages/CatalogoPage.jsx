import { Container, Alert } from 'react-bootstrap'
import Catalogo from '../components/Catalogo.jsx'

function CatalogoPage({ cargando, error, ...catalogoProps }) {
    return (
        <Container className="py-4" id="catalogo">
            <h2 className="mb-3">Catálogo de videojuegos</h2>
            {cargando && <p>Cargando productos...</p>}
            {error && <Alert variant='danger'>{error}</Alert>}

            {!cargando && !error && (
                <Catalogo {...catalogoProps} />
            )}
        </Container>
    )
}

export default CatalogoPage
