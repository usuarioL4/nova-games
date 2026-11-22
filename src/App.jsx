

import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { Container, Button, Alert } from 'react-bootstrap'
import Encabezado from './components/Encabezado.jsx'
import Pie from './components/Pie.jsx'
import { useProductos } from './hooks/useProductos.js'
import AuthPage from './components/AuthPage.jsx'
import './App.css'
import AdminProductosPage from './pages/AdminProductosPage.jsx'
import AdminLayout from './pages/AdminLayout.jsx'
import AdminUsuariosPage from './pages/AdminUsuariosPage.jsx'
import AdminContactoPage from './pages/AdminContactoPage.jsx'
import AdminEstadisticasPage from './pages/AdminEstadisticasPage.jsx'
import InicioPage from './pages/InicioPage.jsx'
import CatalogoPage from './pages/CatalogoPage.jsx'
import ProductoDetallePage from './pages/ProductoDetallePage.jsx'
import ComunidadPage from './pages/ComunidadPage.jsx'
import ContactoPage from './pages/ContactoPage.jsx'
import NosotrosPage from './pages/NosotrosPage.jsx'
import NoEncontradoPage from './pages/NoEncontradoPage.jsx'

function App() {
    const navigate = useNavigate();
    const { productos, cargando, error,recargarProductos } = useProductos();
    const [sesion, setSesion] = useState(() => {
        const guardada = sessionStorage.getItem('nova-games-sesion');
        try{
            return guardada ? JSON.parse(guardada) : null;
        }catch{
            return null;
        }
    });
    const [carrito, setCarrito] = useState(() => {
        return JSON.parse(localStorage.getItem('nova-games-carrito')) || []
    })

    const [mostrarCarrito, setMostrarCarrito] = useState(false)

    const [busqueda, setBusqueda] = useState('')
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('')
    const [plataformaSeleccionada, setPlataformaSeleccionada] = useState('')
    const [precioSeleccionado, setPrecioSeleccionado] = useState('')
    const [soloDisponibles, setSoloDisponibles] = useState(false)
    const [orden, setOrden] = useState('relevancia')
    useEffect(() => {
        if(sesion){
            sessionStorage.setItem('nova-games-sesion',JSON.stringify(sesion));    
        }else{
            sessionStorage.removeItem('nova-games-sesion');
        }
    },[sesion]);

    useEffect(() => {
        localStorage.setItem('nova-games-carrito', JSON.stringify(carrito))
    }, [carrito])

    function iniciarSesion(nuevaSesion) {
        setSesion(nuevaSesion)
        navigate('/')
    }

    function cerrarSesion() {
        setSesion(null)
        navigate('/')
    }

    function agregarAlCarrito(producto) {
        if (producto.stock <= 0) return

        const productoExistente = carrito.find(p => p.id === producto.id)

        if (productoExistente) {
            if (productoExistente.cantidad >= producto.stock) return

            setCarrito(carrito.map(p =>
                p.id === producto.id
                    ? { ...p, cantidad: p.cantidad + 1 }
                    : p
            ))
        } else {
            setCarrito([...carrito, { ...producto, cantidad: 1 }])
        }
    }

    function eliminarDelCarrito(id) {
        setCarrito(carrito.filter(p => p.id !== id))
    }

    const cantidad = carrito.reduce(
        (total, producto) => total + producto.cantidad,
        0
    )

    const categorias = [...new Set(productos.map(p => p.categoria))]
    const plataformas = [...new Set(productos.flatMap(p => p.plataformas))]

    let productosFiltrados = productos.filter(producto => {
        const coincideNombre = producto.nombre
            .toLowerCase()
            .includes(busqueda.toLowerCase().trim())

        const coincideCategoria =
            categoriaSeleccionada === '' ||
            producto.categoria === categoriaSeleccionada

        const coincidePlataforma =
            plataformaSeleccionada === '' ||
            producto.plataformas.includes(plataformaSeleccionada)

        const coincidePrecio =
            precioSeleccionado === '' ||
            (precioSeleccionado === 'bajo' && producto.precio < 20000) ||
            (precioSeleccionado === 'medio' && producto.precio >= 20000 && producto.precio <= 40000) ||
            (precioSeleccionado === 'alto' && producto.precio > 40000)

        const coincideDisponibilidad = !soloDisponibles || producto.stock > 0

        return coincideNombre && coincideCategoria && coincidePlataforma && coincidePrecio && coincideDisponibilidad
    })

    if (orden === 'nombre') {
        productosFiltrados.sort((a, b) =>
            a.nombre.localeCompare(b.nombre)
        )
    } else if (orden === 'precioMenor') {
        productosFiltrados.sort((a, b) => a.precio - b.precio)
    } else if (orden === 'precioMayor') {
        productosFiltrados.sort((a, b) => b.precio - a.precio)
    }

    function limpiarFiltros() {
        setBusqueda('')
        setCategoriaSeleccionada('')
        setPlataformaSeleccionada('')
        setPrecioSeleccionado('')
        setSoloDisponibles(false)
        setOrden('relevancia')
    }

    const esAdmin = sesion?.user?.role === 'ADMIN'

    return (
        <>
            <Encabezado
                cantidad={cantidad}
                onVerCarrito={() => setMostrarCarrito(!mostrarCarrito)}
                busqueda={busqueda}
                onCambiarBusqueda={setBusqueda}
                onBuscar={() => setBusqueda(busqueda.trim())}
                sesion={sesion}
                onLogout={cerrarSesion}
            />

            {mostrarCarrito && (
                <Container className="pt-3">
                    <Alert variant="light" className="border">
                        <div className="d-flex justify-content-between align-items-center">
                            <h4>Mi carrito</h4>

                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => setMostrarCarrito(false)}
                            >
                                Cerrar
                            </Button>
                        </div>

                        {carrito.length === 0 ? (
                            <p>Tu carrito está vacío.</p>
                        ) : (
                            <>
                                {carrito.map(producto => (
                                    <div
                                        key={producto.id}
                                        className="d-flex justify-content-between align-items-center border-bottom py-2 gap-2"
                                    >
                                        <span>
                                            <Link
                                                to={`/productos/${producto.id}`}
                                                className="text-reset"
                                                onClick={() => setMostrarCarrito(false)}
                                            >
                                                {producto.nombre}
                                            </Link>
                                            {' '}× {producto.cantidad}
                                        </span>

                                        <Button
                                            size="sm"
                                            variant="outline-danger"
                                            onClick={() => eliminarDelCarrito(producto.id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                ))}

                                <h5 className="mt-3">
                                    Total: $
                                    {carrito.reduce(
                                        (total, producto) =>
                                            total + producto.precio * producto.cantidad,
                                        0
                                    ).toLocaleString('es-CL')}
                                </h5>
                            </>
                        )}
                    </Alert>
                </Container>
            )}

            <Routes>
                <Route
                    path="/"
                    element={
                        <InicioPage
                            productos={productos}
                            cargando={cargando}
                            error={error}
                            onAgregarProducto={agregarAlCarrito}
                            onSeleccionarCategoria={setCategoriaSeleccionada}
                        />
                    }
                />
                <Route
                    path="/productos"
                    element={
                        <CatalogoPage
                            cargando={cargando}
                            error={error}
                            productos={productosFiltrados}
                            categorias={categorias}
                            plataformas={plataformas}
                            categoriaSeleccionada={categoriaSeleccionada}
                            onCambiarCategoria={setCategoriaSeleccionada}
                            plataformaSeleccionada={plataformaSeleccionada}
                            onCambiarPlataforma={setPlataformaSeleccionada}
                            precioSeleccionado={precioSeleccionado}
                            onCambiarPrecio={setPrecioSeleccionado}
                            soloDisponibles={soloDisponibles}
                            onCambiarDisponibles={setSoloDisponibles}
                            busqueda={busqueda}
                            onCambiarBusqueda={setBusqueda}
                            orden={orden}
                            onCambiarOrden={setOrden}
                            onLimpiarFiltros={limpiarFiltros}
                            onAgregarProducto={agregarAlCarrito}
                        />
                    }
                />
                <Route
                    path="/productos/:id"
                    element={<ProductoDetallePage onAgregarProducto={agregarAlCarrito} />}
                />
                <Route path="/comunidad" element={<ComunidadPage sesion={sesion} />} />
                <Route path="/contacto" element={<ContactoPage />} />
                <Route path="/nosotros" element={<NosotrosPage />} />
                <Route
                    path="/login"
                    element={
                        <AuthPage
                            key="login"
                            vistaInicial="login"
                            sesion={sesion}
                            onLogin={iniciarSesion}
                            onLogout={cerrarSesion}
                        />
                    }
                />
                <Route
                    path="/registro"
                    element={
                        <AuthPage
                            key="registro"
                            vistaInicial="registro"
                            sesion={sesion}
                            onLogin={iniciarSesion}
                            onLogout={cerrarSesion}
                        />
                    }
                />
                <Route
                    path="/admin"
                    element={esAdmin ? <AdminLayout /> : <Navigate to="/login" replace />}
                >
                    <Route index element={
                        <AdminEstadisticasPage
                            token={sesion?.accessToken}
                            productos={productos}
                            cargandoProductos={cargando}
                            errorProductos={error}
                        />
                    } />
                    <Route path="productos" element={
                        <AdminProductosPage
                            token={sesion?.accessToken}
                            productos={productos}
                            cargando={cargando}
                            error={error}
                            onProductosActualizados={recargarProductos}
                        />
                    } />
                    <Route path="usuarios" element={<AdminUsuariosPage token={sesion?.accessToken} />} />
                    <Route path="contacto" element={<AdminContactoPage token={sesion?.accessToken} />} />
                </Route>
                <Route path="*" element={<NoEncontradoPage />} />
            </Routes>

            <Pie />
        </>
    )
}

export default App
