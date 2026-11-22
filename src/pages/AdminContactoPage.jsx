import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { actualizarEstadoContacto, listarMensajesContacto } from '../services/contacto';

function AdminContactoPage({token}) {
    const [mensajes,setMensajes] = useState([]);
    const [cargando,setCargando] = useState(true);
    const [error,setError] = useState('');
    const [mensaje,setMensaje] = useState('');
    const [actualizando,setActualizando] = useState(null);
    const [filtro,setFiltro] = useState('pendientes');
    const [busqueda,setBusqueda] = useState('');
    const [version,setVersion] = useState(0);

    useEffect(() => {
        let activo = true;
        async function cargar() {
            setCargando(true);
            setError('');
            try {
                const respuesta = await listarMensajesContacto(token);
                if(activo) setMensajes(Array.isArray(respuesta) ? respuesta : []);
            } catch(err) {
                if(activo) setError(err.response?.data?.message || 'No se pudieron consultar los mensajes');
            } finally {
                if(activo) setCargando(false);
            }
        }
        cargar();
        return () => {activo=false};
    },[token,version]);

    async function cambiarEstado(item) {
        setActualizando(item.id);
        setError('');
        setMensaje('');
        try {
            const actualizado = await actualizarEstadoContacto(item.id,!item.resuelto,token);
            setMensajes(actuales => actuales.map(m => m.id === item.id ? actualizado : m));
            setMensaje(actualizado.resuelto ? 'Mensaje marcado como resuelto.' : 'Mensaje marcado como pendiente.');
        } catch(err) {
            setError(err.response?.data?.message || 'No se pudo actualizar el mensaje');
        } finally {
            setActualizando(null);
        }
    }

    const visibles = mensajes.filter(item => {
        const coincideEstado = filtro === 'todos' || (filtro === 'pendientes' ? !item.resuelto : item.resuelto);
        const texto = `${item.nombre} ${item.email} ${item.asunto} ${item.mensaje}`.toLowerCase();
        return coincideEstado && texto.includes(busqueda.trim().toLowerCase());
    });
    const pendientes = mensajes.filter(item => !item.resuelto).length;

    return (
        <Container className="my-4">
            <Row className="g-2 align-items-center mb-3">
                <Col><h2 className="h4 mb-0">Bandeja de contacto <Badge bg="warning" text="dark">{pendientes} pendientes</Badge></h2></Col>
                <Col xs="auto"><Button size="sm" variant="outline-light" onClick={() => setVersion(v => v+1)}>Actualizar</Button></Col>
            </Row>
            {error && <Alert variant="danger">{error}</Alert>}
            {mensaje && <Alert variant="success" dismissible onClose={() => setMensaje('')}>{mensaje}</Alert>}
            <Card className="admin-card p-3 p-md-4">
                <Row className="g-2 mb-3">
                    <Col md={8}><Form.Control aria-label="Buscar mensajes" placeholder="Buscar por nombre, asunto o contenido" value={busqueda} onChange={e => setBusqueda(e.target.value)}/></Col>
                    <Col md={4}><Form.Select aria-label="Filtrar mensajes" value={filtro} onChange={e => setFiltro(e.target.value)}>
                        <option value="pendientes">Pendientes</option><option value="resueltos">Resueltos</option><option value="todos">Todos</option>
                    </Form.Select></Col>
                </Row>
                {cargando ? <p>Cargando mensajes...</p> : !error && <div className="table-responsive">
                    <Table striped hover variant="dark" className="align-middle mb-0">
                        <thead><tr><th>Remitente</th><th>Consulta</th><th>Fecha</th><th>Estado</th><th>Acción</th></tr></thead>
                        <tbody>
                            {visibles.map(item => <tr key={item.id}>
                                <td><div className="fw-semibold">{item.nombre}</div><a href={`mailto:${item.email}`} className="small">{item.email}</a></td>
                                <td className="admin-mensaje"><strong>{item.asunto}</strong><p className="small mb-0 mt-1" style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{item.mensaje}</p></td>
                                <td className="small">{item.fecha ? new Date(item.fecha).toLocaleString('es-CL') : '—'}</td>
                                <td><Badge bg={item.resuelto ? 'success' : 'warning'} text={item.resuelto ? undefined : 'dark'}>{item.resuelto ? 'Resuelto' : 'Pendiente'}</Badge></td>
                                <td><Button size="sm" variant={item.resuelto ? 'outline-warning' : 'outline-success'} disabled={actualizando === item.id} onClick={() => cambiarEstado(item)}>
                                    {actualizando === item.id ? 'Guardando...' : item.resuelto ? 'Reabrir' : 'Resolver'}
                                </Button></td>
                            </tr>)}
                            {visibles.length === 0 && <tr><td colSpan={5} className="text-center py-4">No hay mensajes que coincidan con los filtros.</td></tr>}
                        </tbody>
                    </Table>
                </div>}
            </Card>
        </Container>
    );
}

export default AdminContactoPage;
