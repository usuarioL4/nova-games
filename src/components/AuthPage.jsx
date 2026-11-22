
import { useState } from 'react';
import { Button, Alert, Container } from 'react-bootstrap';
import Login from './Login';
import Registro from './Registro';

function AuthPage({sesion,onLogin,onLogout,vistaInicial = 'login'}){
    const [vista,setVista] = useState(vistaInicial);

    return (
        <Container className="my-4">
            {sesion ? (
                <Alert variant="success">
                    <h4>Bienvenido, {sesion.user.username}</h4>
                    <p>Rol: {sesion.user.role}</p>

                    <Button
                        variant="outline-dark"
                        onClick={onLogout}>
                        Cerrar sesión
                    </Button>
                </Alert>
            ) : (
                <>
                    <div className="d-flex justify-content-center gap-2">
                        <Button variant={vista === 'login' ? 'primary' : 'outline-primary'} 
                        onClick={() => setVista('login')}>
                            Login
                        </Button>

                        <Button variant={vista === 'registro' ? 'primary' : 'outline-primary'} 
                        onClick={() => setVista('registro')}>
                            Registro
                        </Button>
                    </div>

                    {vista === 'login' ? (
                        <Login onLogin={onLogin}/>
                    ) : (
                        <Registro/>
                    )}
                </>
            )}
        </Container>
    );
}

export default AuthPage;
