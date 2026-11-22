import { Badge, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const dinero = valor => Number(valor).toLocaleString('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0});

function ProductosTable({productos,onEditar,onEliminar,eliminandoId}) {
    if(productos.length === 0) return <p className="text-secondary mb-0 py-3 text-center">No hay productos que coincidan con tu búsqueda.</p>;

    return (
        <div className="table-responsive">
            <Table striped hover variant="dark" className="align-middle mb-0">
                <thead>
                    <tr>
                        <th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map(producto => (
                        <tr key={producto.id}>
                            <td>
                                <div className="d-flex align-items-center gap-3">
                                    <img className="admin-miniatura" src={producto.imagen} alt="" onError={e => {e.currentTarget.style.visibility='hidden'}} />
                                    <div>
                                        <Link className="link-light fw-semibold text-decoration-none" to={`/productos/${producto.id}`}>{producto.nombre}</Link>
                                        <div className="small text-secondary">#{producto.id} · {(producto.plataformas || []).join(', ')}</div>
                                    </div>
                                </div>
                            </td>
                            <td>{producto.categoria}</td>
                            <td>{dinero(producto.precio)}</td>
                            <td>
                                <Badge bg={producto.stock === 0 ? 'danger' : producto.stock <= 5 ? 'warning' : 'success'} text={producto.stock <= 5 && producto.stock > 0 ? 'dark' : undefined}>
                                    {producto.stock}
                                </Badge>
                            </td>
                            <td>
                                <div className="d-flex gap-2 flex-wrap">
                                    <Button size="sm" variant="outline-info" onClick={() => onEditar(producto)}>Editar</Button>
                                    <Button size="sm" variant="outline-danger" disabled={eliminandoId === producto.id} onClick={() => onEliminar(producto)}>
                                        {eliminandoId === producto.id ? 'Eliminando...' : 'Eliminar'}
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default ProductosTable;
