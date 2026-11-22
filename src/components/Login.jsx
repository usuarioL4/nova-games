import { useState } from "react";
import { Form,Button,Alert,Card} from 'react-bootstrap';
import { iniciarSesion } from "../services/auth";

function Login({onLogin}){
    const [datos,setDatos] = useState({
        email: '',
        password: ''
    });

    const [error,setError] = useState('');
    const [cargando,setCargando] = useState(false);

    function handleChange(e){
        const {name, value} = e.target;
        setDatos({
            ...datos,
            [name]: value
        });
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setCargando(true);
       try {
            const respuesta = await iniciarSesion(datos);
            onLogin(respuesta);
        } catch(err) {
            setError(err.response?.data?.message || 'No se pudo iniciar sesión');
        } finally {
            setCargando(false);
}
    }

    return (
        <Card className="mx-auto my-4 p-4" style={{maxWidth: 500}} id="registro">
            <h3>Iniciar sesion</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
        
                    <Form.Group className="mb-3">
                        <Form.Label>Correo eletronico</Form.Label>
                        <Form.Control
                            name='email'
                            type='email'
                            value={datos.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            name='password'
                            type='password'
                            value={datos.password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                
                    <Button type="submit" disabled={cargando}>
                        {cargando ? 'Ingresando...' : 'Iniciar sesion'}
                    </Button>
            </Form>
        </Card>    
    );


}
export default Login;