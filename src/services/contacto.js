import api from './api';

export async function enviarContacto(datos) {
    const response = await api.post('/api/contacto',datos);
    return response.data;
}

export async function listarMensajesContacto(token) {
    const response = await api.get('/api/admin/contacto',{
        headers:{ Authorization:`Bearer ${token}` }
    });
    return response.data;
}

export async function actualizarEstadoContacto(id,resuelto,token) {
    const response = await api.put(`/api/admin/contacto/${id}`,{resuelto},{
        headers:{ Authorization:`Bearer ${token}` }
    });
    return response.data;
}
