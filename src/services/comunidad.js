import api from './api';

export async function listarComentarios() {
    const response = await api.get('/api/comunidad')
    return response.data;
}

export async function crearComentario(comentario,token) {
    const response = await api.post('/api/comunidad',comentario,{
        headers:{
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export async function eliminarComentario(id,token) {
    await api.delete(`/api/comunidad/${id}`,{
        headers:{
            Authorization: `Bearer ${token}`
        }
    });
}
