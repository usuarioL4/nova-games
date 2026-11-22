import api from './api';

export async function listarUsuarios(token) {
    const response = await api.get('/api/admin/usuarios',{
        headers:{ Authorization:`Bearer ${token}` }
    });
    return response.data;
}
