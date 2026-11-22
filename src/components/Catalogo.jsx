
import { Row, Col, Form, Button } from 'react-bootstrap'
import TarjetaProducto from './TarjetaProducto.jsx'

function Catalogo({
    productos,
    categorias,
    plataformas,
    categoriaSeleccionada,
    onCambiarCategoria,
    plataformaSeleccionada,
    onCambiarPlataforma,
    precioSeleccionado,
    onCambiarPrecio,
    soloDisponibles,
    onCambiarDisponibles,
    orden,
    onCambiarOrden,
    onLimpiarFiltros,
    onAgregarProducto
}) {
    return (
        <Row className="g-4">

            {/* Barra lateral */}
            <Col xs={12} md={3} className="filter-panel">
                <h4>Filtros</h4>

                <Form>

                    <h5>Categoría</h5>

                    {categorias.map((categoria, index) => (
                        <Form.Check
                            key={categoria}
                            id={`categoria-${index}`}
                            type="radio"
                            name="categoria"
                            label={categoria}
                            checked={categoriaSeleccionada === categoria}
                            onChange={() => onCambiarCategoria(categoria)}
                        />
                    ))}

                    <Form.Check
                        type="radio"
                        id="categoria-todas"
                        name="categoria"
                        label="Todas"
                        checked={categoriaSeleccionada === ''}
                        onChange={() => onCambiarCategoria('')}
                    />

                    <h5>Plataforma</h5>

                    {plataformas.map((plataforma, index) => (
                        <Form.Check
                            key={plataforma}
                            id={`plataforma-${index}`}
                            type="radio"
                            name="plataforma"
                            label={plataforma}
                            checked={plataformaSeleccionada === plataforma}
                            onChange={() => onCambiarPlataforma(plataforma)}
                        />
                    ))}

                    <Form.Check
                        type="radio"
                        id="plataforma-todas"
                        name="plataforma"
                        label="Todas"
                        checked={plataformaSeleccionada === ''}
                        onChange={() => onCambiarPlataforma('')}
                    />

                    <h5>Precio</h5>

                    {[
                        { valor: 'bajo', etiqueta: 'Menos de $20.000' },
                        { valor: 'medio', etiqueta: '$20.000 - $40.000' },
                        { valor: 'alto', etiqueta: 'Más de $40.000' }
                    ].map(rango => (
                        <Form.Check
                            key={rango.valor}
                            id={`precio-${rango.valor}`}
                            type="radio"
                            name="precio"
                            label={rango.etiqueta}
                            checked={precioSeleccionado === rango.valor}
                            onChange={() => onCambiarPrecio(rango.valor)}
                        />
                    ))}

                    <Form.Check
                        type="radio"
                        id="precio-todos"
                        name="precio"
                        label="Todos"
                        checked={precioSeleccionado === ''}
                        onChange={() => onCambiarPrecio('')}
                    />

                    <h5>Disponibilidad</h5>

                    <Form.Check
                        type="checkbox"
                        id="solo-disponibles"
                        label="Solo disponibles"
                        checked={soloDisponibles}
                        onChange={(e) => onCambiarDisponibles(e.target.checked)}
                    />


                    <Form.Group className="mt-3">
                        <Form.Label>Ordenar por</Form.Label>
                        <Form.Select
                            value={orden}
                            onChange={(e) => onCambiarOrden(e.target.value)}
                        >
                            <option value="relevancia">Relevancia</option>
                            <option value="nombre">Nombre</option>
                            <option value="precioMenor">Precio: menor a mayor</option>
                            <option value="precioMayor">Precio: mayor a menor</option>
                        </Form.Select>
                    </Form.Group>

                    <Button
                        className="mt-3"
                        variant="outline-secondary"
                        onClick={onLimpiarFiltros}
                    >
                        Limpiar filtros
                    </Button>
                </Form>
            </Col>

            {/* Catálogo de productos */}
            <Col xs={12} md={9}>
                <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
                    {productos.length === 0 ? (
                  <Col className="d-flex justify-content-center align-items-center py-5">
                    <p className="mb-0">No hay productos para mostrar.</p>
                  </Col>
                    ) : (
                        productos.map((producto) => (
                            <Col key={producto.id}>
                                <TarjetaProducto
                                    producto={producto}
                                    onAgregarProducto={onAgregarProducto}
                                />
                            </Col>
                        ))
                    )}
                </Row>
            </Col>

        </Row>
    )
}

export default Catalogo
