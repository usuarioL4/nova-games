import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, ProgressBar, Row } from 'react-bootstrap';
import { listarUsuarios } from '../services/usuarios';
import { listarMensajesContacto } from '../services/contacto';

const dinero = valor => Number(valor).toLocaleString('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0});

function Indicador({titulo,valor,detalle}) {
    return <Col sm={6} xl={3}>
        <Card className="admin-card admin-indicador h-100 p-3">
            <p className="small text-secondary mb-2">{titulo}</p>
            <strong className="display-6">{valor}</strong>
            {detalle && <p className="small text-secondary mt-2 mb-0">{detalle}</p>}
        </Card>
    </Col>;
}

function AdminEstadisticasPage({token,productos,cargandoProductos,errorProductos}) {
    const [usuarios,setUsuarios] = useState(null);
    const [mensajes,setMensajes] = useState(null);
    const [errores,setErrores] = useState([]);
    const [cargando,setCargando] = useState(true);
    const [version,setVersion] = useState(0);

    useEffect(() => {
        let activo = true;
        setCargando(true);
        async function cargar() {
            const [resUsuarios,resMensajes] = await Promise.allSettled([
                listarUsuarios(token),listarMensajesContacto(token)
            ]);
            if(!activo) return;
            const fallos = [];
            if(resUsuarios.status === 'fulfilled') setUsuarios(resUsuarios.value);
            else {setUsuarios(null);fallos.push('usuarios: '+(resUsuarios.reason?.response?.data?.message || 'sin conexión'));}
            if(resMensajes.status === 'fulfilled') setMensajes(resMensajes.value);
            else {setMensajes(null);fallos.push('contacto: '+(resMensajes.reason?.response?.data?.message || 'sin conexión'));}
            setErrores(fallos);
            setCargando(false);
        }
        cargar();
        return () => {activo=false};
    },[token,version]);

    const totalStock = productos.reduce((total,p) => total+Number(p.stock || 0),0);
    const sinStock = productos.filter(p => p.stock === 0).length;
    const stockBajo = productos.filter(p => p.stock > 0 && p.stock <= 5).length;
    const valorInventario = productos.reduce((total,p) => total+Number(p.precio || 0)*Number(p.stock || 0),0);
    const pendientes = mensajes?.filter(m => !m.resuelto).length;
    const administradores = usuarios?.filter(u => u.role === 'ADMIN').length;
    const categorias = Object.entries(productos.reduce((acum,p) => {
        const categoria = p.categoria || 'Sin categoría';
        acum[categoria] = (acum[categoria] || 0)+1;
        return acum;
    },{})).sort((a,b) => b[1]-a[1]);
    const total = productos.length;
    const sinProductos = cargandoProductos || Boolean(errorProductos);

    return <Container className="my-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div><h2 className="h4 mb-1">Resumen del negocio</h2><p className="text-secondary small mb-0">Indicadores actuales a partir de las APIs, sin datos simulados.</p></div>
            <Button size="sm" variant="outline-light" onClick={() => setVersion(v => v+1)} disabled={cargando}>Actualizar indicadores</Button>
        </div>
        {errorProductos && <Alert variant="warning">No se pudieron consultar los productos: {errorProductos}</Alert>}
        {errores.length>0 && <Alert variant="warning">Datos parciales: {errores.join(' · ')}</Alert>}
        <Row className="g-3 mb-4">
            <Indicador titulo="Productos publicados" valor={sinProductos ? '—' : total} detalle="Productos activos en el catálogo"/>
            <Indicador titulo="Usuarios registrados" valor={cargando || !usuarios ? '—' : usuarios.length} detalle={administradores == null ? 'No disponible' : `${administradores} administradores`}/>
            <Indicador titulo="Mensajes pendientes" valor={cargando || !mensajes ? '—' : pendientes} detalle={mensajes ? `${mensajes.length} mensajes recibidos` : 'No disponible'}/>
            <Indicador titulo="Unidades en inventario" valor={sinProductos ? '—' : totalStock.toLocaleString('es-CL')} detalle="Suma del stock de productos activos"/>
            <Indicador titulo="Sin stock" valor={sinProductos ? '—' : sinStock} detalle="Productos sin unidades disponibles"/>
            <Indicador titulo="Stock bajo" valor={sinProductos ? '—' : stockBajo} detalle="Productos con 1 a 5 unidades"/>
            <Indicador titulo="Valor del inventario" valor={sinProductos ? '—' : dinero(valorInventario)} detalle="Precio × stock, no ingresos por ventas"/>
            <Indicador titulo="Categorías" valor={sinProductos ? '—' : categorias.length} detalle="Categorías presentes en el catálogo"/>
        </Row>
        <Card className="admin-card p-3 p-md-4">
            <h3 className="h5 mb-3">Distribución del catálogo por categoría</h3>
            {sinProductos ? <p className="text-secondary">Catálogo no disponible.</p> : categorias.length === 0 ? <p className="text-secondary mb-0">Aún no hay productos para calcular la distribución.</p> :
                categorias.map(([nombre,cantidad]) => <div key={nombre} className="mb-3">
                    <div className="d-flex justify-content-between small mb-1"><span>{nombre}</span><span>{cantidad} de {total} ({Math.round(cantidad/total*100)}%)</span></div>
                    <ProgressBar now={cantidad/total*100} variant="info" aria-label={`Categoría ${nombre}`} />
                </div>)
            }
        </Card>
        <p className="small text-secondary mt-3 mb-0">No se incluyen pedidos, ventas ni ingresos: todavía no existe un flujo de compras habilitado en el frontend.</p>
    </Container>;
}

export default AdminEstadisticasPage;
