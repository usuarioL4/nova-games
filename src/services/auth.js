import api from './api';
export async function registrarUsuario(datos) {
    const response = await api.post('/api/auth/register',datos);
    return response.data;
}

export async function iniciarSesion(datos) {
    const response = await api.post('/api/auth/login',datos)
    return response.data;
}

