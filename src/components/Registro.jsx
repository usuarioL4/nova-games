import { useState } from "react";
import { Form,Button,Alert,Card} from 'react-bootstrap';
import { registrarUsuario } from "../services/auth";

function Registro(){
    const [datos,setDatos] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        cellphone: '',
        ageConfirmed: false
    });
    const [error,setError] = useState('');
    const [mensaje,setMensaje] = useState('');
    const [cargando,setCargando] = useState(false);

    function handleChange(e){
        const {name, value, type, checked } = e.target;
        setDatos({
            ...datos,
            [name]: type === 'checkbox' ? checked : value
        });
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setMensaje('');
        setCargando(true);
        try{
            const usuario = await registrarUsuario(datos);
            setMensaje(`Usuario ${usuario.username} registrado correctamente`);
        
        } catch (err){
            setError(err.response?.data?.message || 'No se pudo registrar el usuario');
        
        } finally{
            setCargando(false);
        }
    }

    return (
        <Card className="mx-auto my-4 p-4" style={{maxWidth: 500}} id="registro">
            <h3>Crear cuenta</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            {mensaje && <Alert variant="success">{mensaje}</Alert>}
            <Form onSubmit={handleSubmit}>
                {['username','email','password','confirmPassword','cellphone','referenceCode'].map(campo => (
                    <Form.Group className="mb-3" key={campo}>
                        <Form.Label>{campo}</Form.Label>
                        <Form.Control
                            name={campo}
                            type={campo.toLowerCase().includes('password') ? 'password' : campo === 'email' ? 'email' : 'text'}
                            value={datos[campo]}
                            onChange={handleChange}
                            required={campo !== 'referenceCode'}
                        />
                    </Form.Group>
                ))}
                <Form.Check
                    className="mb-3"
                    type='checkbox'
                    label="Confirmo que soy mayor de edad"
                    name="ageConfirmed"
                    checked={datos.ageConfirmed}
                    onChange={handleChange}
                    required
                />
                    <Button type="submit" disabled={cargando}>
                        {cargando ? 'Registrando...' : 'Registrarse'}
                    </Button>
            </Form>
        </Card>    
    );


}
export default Registro;