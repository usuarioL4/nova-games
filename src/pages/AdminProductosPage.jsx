import { useRef, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import ProductoForm from '../components/admin/ProductoForm';
import ProductosTable from '../components/admin/ProductosTable';
import { eliminarProducto } from '../services/catalog';

function AdminProductosPage({token,productos,cargando,error,onProductosActualizados}) {
    const [productoEditar,setProductoEditar] = useState(null);
    const [productoEliminar,setProductoEliminar] = useState(null);
    const [eliminando,setEliminando] = useState(false);
    const [busqueda,setBusqueda] = useState('');
    const [mensaje,setMensaje] = useState('');
    const [errorAccion,setErrorAccion] = useState('');
    const refFormulario = useRef(null);

    const visibles = productos.filter(p =>
        `${p.nombre} ${p.categoria} ${p.id}`.toLowerCase().includes(busqueda.trim().toLowerCase())
    );

    function seleccionarEditar(producto) {
        setProductoEditar(producto);
        setMensaje('');
        setErrorAccion('');
        refFormulario.current?.scrollIntoView({behavior:'smooth',block:'start'});
    }

    function handleGuardado(producto,editando) {
        setProductoEditar(null);
        setMensaje(editando ? `Se actualizó ${producto.nombre}.` : `Se creó ${producto.nombre}.`);
        setErrorAccion('');
        onProductosActualizados();
    }

    async function confirmarEliminar() {
        if(!productoEliminar) return;
        setEliminando(true);
        setMensaje('');
        setErrorAccion('');
        try {
            await eliminarProducto(productoEliminar.id,token);
            setMensaje(`Se eliminó ${productoEliminar.nombre} del catálogo.`);
            if(productoEditar?.id === productoEliminar.id) setProductoEditar(null);
            setProductoEliminar(null);
            onProductosActualizados();
        } catch(err) {
            setErrorAccion(err.response?.data?.message || 'No se pudo eliminar el producto');
        } finally {
            setEliminando(false);
        }
    }

    return (
        <Container className="my-4">
            <div ref={refFormulario} className="admin-scroll-target" />
            <Row className="align-items-center mb-3 g-2">
                <Col><h2 className="h4 mb-0">Gestión de productos</h2></Col>
                <Col xs="auto"><Button variant="outline-light" size="sm" onClick={onProductosActualizados}>Actualizar listado</Button></Col>
            </Row>
            {mensaje && <Alert variant="success" dismissible onClose={() => setMensaje('')}>{mensaje}</Alert>}
            {errorAccion && <Alert variant="danger" dismissible onClose={() => setErrorAccion('')}>{errorAccion}</Alert>}
            <ProductoForm token={token} productoEditar={productoEditar} onGuardado={handleGuardado} onCancelar={() => setProductoEditar(null)} />
            <Card className="admin-card p-3 p-md-4">
                <Row className="align-items-center g-3 mb-3">
                    <Col md={5}><h3 className="h5 mb-0">Productos registrados ({productos.length})</h3></Col>
                    <Col md={{span:6,offset:1}}>
                        <Form.Control aria-label="Buscar productos" placeholder="Buscar por nombre, categoría o ID" value={busqueda} onChange={e => setBusqueda(e.target.value)}/>
                    </Col>
                </Row>
                {cargando && <p>Cargando productos...</p>}
                {error && <Alert variant="danger">{error}</Alert>}
                {!cargando && !error && <ProductosTable productos={visibles} onEditar={seleccionarEditar} onEliminar={setProductoEliminar} eliminandoId={eliminando ? productoEliminar?.id : null}/>}
            </Card>
            <Modal show={Boolean(productoEliminar)} onHide={() => !eliminando && setProductoEliminar(null)} centered>
                <Modal.Header closeButton={!eliminando}><Modal.Title>Eliminar producto</Modal.Title></Modal.Header>
                <Modal.Body>¿Eliminar <strong>{productoEliminar?.nombre}</strong> del catálogo? El backend lo desactivará y dejará de aparecer en la tienda.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setProductoEliminar(null)} disabled={eliminando}>Cancelar</Button>
                    <Button variant="danger" onClick={confirmarEliminar} disabled={eliminando}>{eliminando ? 'Eliminando...' : 'Confirmar eliminación'}</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default AdminProductosPage;
