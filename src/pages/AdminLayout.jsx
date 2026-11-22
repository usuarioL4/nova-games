import { Container, Nav } from 'react-bootstrap';
import { NavLink, Outlet } from 'react-router-dom';
import '../styles/admin.css';

function AdminLayout() {
    return (
        <div className="admin-area pb-5">
            <Container className="pt-4">
                <p className="admin-kicker mb-1">NOVA GAMES / BACKOFFICE</p>
                <h1 className="h2 mb-2">Panel de administración</h1>
                <p className="text-secondary mb-4">Gestión de catálogo, usuarios y solicitudes de contacto.</p>
                <Nav className="admin-nav gap-2 flex-wrap" aria-label="Navegación de administración">
                    <Nav.Link as={NavLink} to="/admin" end>Estadísticas</Nav.Link>
                    <Nav.Link as={NavLink} to="/admin/productos">Productos</Nav.Link>
                    <Nav.Link as={NavLink} to="/admin/usuarios">Usuarios</Nav.Link>
                    <Nav.Link as={NavLink} to="/admin/contacto">Contacto</Nav.Link>
                </Nav>
            </Container>
            <Outlet />
        </div>
    );
}

export default AdminLayout;
