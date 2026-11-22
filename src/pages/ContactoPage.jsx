import { useState } from 'react'
import { Container, Form, Button, Alert, Card } from 'react-bootstrap'
import { enviarContacto } from '../services/contacto.js'

function ContactoPage() {
    const [datos, setDatos] = useState({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: ''
    })
    const [error, setError] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [cargando, setCargando] = useState(false)

    function handleChange(e) {
        const { name, value } = e.target
        setDatos({
            ...datos,
            [name]: value
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setMensaje('')
        setCargando(true)

        try {
            const respuesta = await enviarContacto(datos)
            setMensaje(respuesta.message || 'Mensaje enviado correctamente')
            setDatos({ nombre: '', email: '', asunto: '', mensaje: '' })
        } catch (err) {
            setError(err.response?.data?.message || 'No se pudo enviar el mensaje')
        } finally {
            setCargando(false)
        }
    }

    const campos = [
        { name: 'nombre', label: 'Nombre', type: 'text' },
        { name: 'email', label: 'Correo electrónico', type: 'email' },
        { name: 'asunto', label: 'Motivo', type: 'text' }
    ]

    return (
        <Container className="py-4">
            <Card className="mx-auto p-4" style={{ maxWidth: 600 }}>
                <h2>Contacta a Nova</h2>
                <p>Envíanos tu mensaje y te responderemos.</p>

                {error && <Alert variant="danger">{error}</Alert>}
                {mensaje && <Alert variant="success">{mensaje}</Alert>}

                <Form onSubmit={handleSubmit}>
                    {campos.map(campo => (
                        <Form.Group className="mb-3" key={campo.name}>
                            <Form.Label>{campo.label}</Form.Label>
                            <Form.Control
                                name={campo.name}
                                type={campo.type}
                                maxLength={100}
                                value={datos[campo.name]}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    ))}

                    <Form.Group className="mb-3">
                        <Form.Label>Comentario</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            name="mensaje"
                            maxLength={500}
                            value={datos.mensaje}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Button type="submit" disabled={cargando}>
                        {cargando ? 'Enviando...' : 'Enviar mensaje'}
                    </Button>
                </Form>
            </Card>
        </Container>
    )
}

export default ContactoPage
