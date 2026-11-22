import { useState } from 'react'
import { Container, Form, Button, Alert, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useComentarios } from '../hooks/useComentarios.js'
import { crearComentario, eliminarComentario } from '../services/comunidad.js'

const mapa = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.336495574519!2d-70.6517173!3d-33.440409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5a0349c2521%3A0x6446e5de50cc7cc8!2sMovistar%20Arena!5e0!3m2!1sen!2scl!4v1714412345678!5m2!1sen!2scl'

function ComunidadPage({ sesion }) {
    const { comentarios, cargando, error, recargarComentarios } = useComentarios()
    const [texto, setTexto] = useState('')
    const [errorEnvio, setErrorEnvio] = useState('')
    const [enviando, setEnviando] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setErrorEnvio('')
        setEnviando(true)

        try {
            await crearComentario({ texto }, sesion.accessToken)
            setTexto('')
            recargarComentarios()
        } catch (err) {
            setErrorEnvio(err.response?.data?.message || 'No se pudo publicar el comentario')
        } finally {
            setEnviando(false)
        }
    }

    async function handleEliminar(id) {
        setErrorEnvio('')

        try {
            await eliminarComentario(id, sesion.accessToken)
            recargarComentarios()
        } catch (err) {
            setErrorEnvio(err.response?.data?.message || 'No se pudo eliminar el comentario')
        }
    }

    function puedeEliminar(comentario) {
        return sesion?.user?.role === 'ADMIN' || sesion?.user?.username === comentario.username
    }

    return (
        <Container className="py-4" id="comunidad">
            <h2 className="mb-3">Discusiones de la comunidad</h2>

            {sesion ? (
                <Form onSubmit={handleSubmit} className="mb-4">
                    <Form.Group className="mb-2">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            maxLength={1000}
                            placeholder="Comparte tus ideas con la comunidad..."
                            value={texto}
                            onChange={(e) => setTexto(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button type="submit" disabled={enviando}>
                        {enviando ? 'Publicando...' : 'Publicar comentario'}
                    </Button>
                </Form>
            ) : (
                <Alert variant="info">
                    <Link to="/login">Inicia sesión</Link> para publicar un comentario.
                </Alert>
            )}

            {errorEnvio && <Alert variant="danger">{errorEnvio}</Alert>}
            {cargando && <p>Cargando comentarios...</p>}
            {error && <Alert variant="danger">{error}</Alert>}

            {!cargando && !error && comentarios.length === 0 && (
                <p>Aún no hay comentarios. ¡Sé el primero en escribir!</p>
            )}

            {comentarios.map(comentario => (
                <Card key={comentario.id} className="mb-3 p-3">
                    <div className="d-flex align-items-center gap-3 mb-2">
                        <div className="avatar-comentario">
                            {comentario.username.charAt(0).toUpperCase()}
                        </div>

                        <div className="flex-grow-1">
                            <h3 className="h6 mb-0">{comentario.username}</h3>
                            <small className="text-secondary">
                                {new Date(comentario.fecha).toLocaleString('es-CL')}
                            </small>
                        </div>

                        {puedeEliminar(comentario) && (
                            <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => handleEliminar(comentario.id)}
                            >
                                Eliminar
                            </Button>
                        )}
                    </div>

                    <p className="mb-0">{comentario.texto}</p>
                </Card>
            ))}

            <section className="mt-5">
                <h2 className="mb-2">Próximos eventos de e-Sports en vivo (mapa)</h2>
                <p>Visita estas ubicaciones para ganar NovaPoints extra.</p>
                <iframe
                    src={mapa}
                    title="Ubicación Movistar Arena"
                    loading="lazy"
                    className="mapa-comunidad"
                />
            </section>

            <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noreferrer"
                className="btn btn-success mt-4"
            >
                💬 Soporte técnico por WhatsApp
            </a>
        </Container>
    )
}

export default ComunidadPage
