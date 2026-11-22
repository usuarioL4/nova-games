import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { listarUsuarios } from '../services/usuarios';

function AdminUsuariosPage({token}) {
    const [usuarios,setUsuarios] = useState([]);
    const [cargando,setCargando] = useState(true);
    const [error,setError] = useState('');
    const [busqueda,setBusqueda] = useState('');
    const [rol,setRol] = useState('');
    const [version,setVersion] = useState(0);

    useEffect(() => {
        let activo = true;
        async function cargar() {
            setCargando(true);
            setError('');
            try {
                const respuesta = await listarUsuarios(token);
                if(activo) setUsuarios(Array.isArray(respuesta) ? respuesta : []);
            } catch(err) {
                if(activo) setError(err.response?.data?.message || 'No se pudieron consultar los usuarios');
            } finally {
                if(activo) setCargando(false);
            }
        }
        cargar();
        return () => {activo=false};
    },[token,version]);

    const visibles = usuarios.filter(usuario => {
        const texto = `${usuario.username} ${usuario.email} ${usuario.cellphone ?? ''}`.toLowerCase();
        return texto.includes(busqueda.trim().toLowerCase()) && (!rol || usuario.role === rol);
    });

    return (
        <Container className="my-4">
            <Row className="g-2 align-items-center mb-3">
                <Col><h2 className="h4 mb-0">Usuarios registrados</h2></Col>
                <Col xs="auto"><Button size="sm" variant="outline-light" onClick={() => setVersion(v => v+1)}>Actualizar</Button></Col>
            </Row>
            <Alert variant="secondary">Los usuarios pueden consultarse, buscarse y filtrarse. El backend actual no incluye endpoints para suspender cuentas ni modificar roles.</Alert>
            <Card className="admin-card p-3 p-md-4">
                <Row className="g-2 mb-3">
                    <Col md={8}><Form.Control aria-label="Buscar usuarios" placeholder="Buscar por usuario, correo o teléfono" value={busqueda} onChange={e => setBusqueda(e.target.value)}/></Col>
                    <Col md={4}><Form.Select aria-label="Filtrar por rol" value={rol} onChange={e => setRol(e.target.value)}>
                        <option value="">Todos los roles</option><option value="USER">USER</option><option value="ADMIN">ADMIN</option>
                    </Form.Select></Col>
                </Row>
                {cargando && <p>Consultando usuarios...</p>}
                {error && <Alert variant="danger">{error}</Alert>}
                {!cargando && !error && <>
                    <p className="small text-secondary">Mostrando {visibles.length} de {usuarios.length} usuarios.</p>
                    <div className="table-responsive">
                        <Table striped hover variant="dark" className="align-middle mb-0">
                            <thead><tr><th>Usuario</th><th>Correo</th><th>Teléfono</th><th>Rol</th></tr></thead>
                            <tbody>
                                {visibles.map(usuario => <tr key={usuario.id}>
                                    <td className="fw-semibold">{usuario.username}</td>
                                    <td>{usuario.email}</td>
                                    <td>{usuario.cellphone || '—'}</td>
                                    <td><Badge bg={usuario.role === 'ADMIN' ? 'info' : 'secondary'}>{usuario.role}</Badge></td>
                                </tr>)}
                                {visibles.length === 0 && <tr><td colSpan={4} className="text-center py-4">No hay usuarios para mostrar.</td></tr>}
                            </tbody>
                        </Table>
                    </div>
                </>}
            </Card>
        </Container>
    );
}

export default AdminUsuariosPage;
