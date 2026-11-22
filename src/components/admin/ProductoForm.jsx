import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { actualizarProducto, crearProducto } from '../../services/catalog';

const formularioVacio = () => ({
    nombre:'',categoria:'',precio:'',stock:'',imagen:'',descripcion:'',plataformas:''
});

function ProductoForm({token,productoEditar=null,onGuardado,onCancelar}) {
    const [datos,setDatos] = useState(formularioVacio);
    const [error,setError] = useState('');
    const [cargando,setCargando] = useState(false);
    const editando = Boolean(productoEditar);

    useEffect(() => {
        setDatos(productoEditar ? {
            nombre:productoEditar.nombre ?? '',
            categoria:productoEditar.categoria ?? '',
            precio:String(productoEditar.precio ?? ''),
            stock:String(productoEditar.stock ?? ''),
            imagen:productoEditar.imagen ?? '',
            descripcion:productoEditar.descripcion ?? '',
            plataformas:(productoEditar.plataformas ?? []).join(', ')
        } : formularioVacio());
        setError('');
    },[productoEditar]);

    function handleChange(e) {
        const {name,value} = e.target;
        setDatos(actual => ({...actual,[name]:value}));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        const producto = {
            nombre:datos.nombre.trim(),
            categoria:datos.categoria.trim(),
            precio:Number(datos.precio),
            stock:Number(datos.stock),
            imagen:datos.imagen.trim(),
            descripcion:datos.descripcion.trim(),
            plataformas:[...new Set(datos.plataformas.split(',').map(p => p.trim()).filter(Boolean))]
        };
        if(producto.plataformas.length === 0) {
            setError('Debes indicar al menos una plataforma.');
            return;
        }
        setCargando(true);
        try {
            const guardado = editando
                ? await actualizarProducto(productoEditar.id,producto,token)
                : await crearProducto(producto,token);
            if(!editando) setDatos(formularioVacio());
            onGuardado?.(guardado,editando);
        } catch(err) {
            setError(err.response?.data?.message || 'No se pudo guardar el producto');
        } finally {
            setCargando(false);
        }
    }

    const campos = [
        {name:'nombre',label:'Nombre',type:'text',maxLength:200},
        {name:'categoria',label:'Categoría',type:'text',maxLength:100},
        {name:'precio',label:'Precio (CLP)',type:'number'},
        {name:'stock',label:'Stock',type:'number'},
        {name:'imagen',label:'Ruta o URL de imagen',type:'text',maxLength:500},
        {name:'plataformas',label:'Plataformas (separadas por coma)',type:'text'}
    ];

    return (
        <Card className="admin-card p-3 p-md-4 mb-4">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <h3 className="h5 mb-0">{editando ? `Editar videojuego #${productoEditar.id}` : 'Agregar videojuego'}</h3>
                {editando && <Button variant="outline-secondary" size="sm" onClick={onCancelar} disabled={cargando}>Cancelar edición</Button>}
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Row>
                    {campos.map(campo => (
                        <Col key={campo.name} md={campo.name === 'imagen' || campo.name === 'plataformas' ? 12 : 6}>
                            <Form.Group className="mb-3">
                                <Form.Label>{campo.label}</Form.Label>
                                <Form.Control
                                    name={campo.name}
                                    type={campo.type}
                                    min={campo.type === 'number' ? 0 : undefined}
                                    step={campo.type === 'number' ? 1 : undefined}
                                    maxLength={campo.maxLength}
                                    value={datos[campo.name]}
                                    onChange={handleChange}
                                    placeholder={campo.name === 'plataformas' ? 'PC, Xbox, PlayStation' : undefined}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    ))}
                </Row>
                <Form.Group className="mb-3">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control as="textarea" rows={3} name="descripcion" value={datos.descripcion} onChange={handleChange} maxLength={2000} required />
                </Form.Group>
                <Button type="submit" disabled={cargando}>
                    {cargando ? 'Guardando...' : editando ? 'Actualizar producto' : 'Crear producto'}
                </Button>
            </Form>
        </Card>
    );
}

export default ProductoForm;
