import api from './api';

export async function listarProductos() {
    const response = await api.get('/api/productos');
    return response.data;
}

export async function crearProducto(producto,token) {
    const response = await api.post('/api/productos',producto,{
        headers:{ Authorization:`Bearer ${token}` }
    });
    return response.data;
}

export async function obtenerProducto(id) {
    const response = await api.get(`/api/productos/${id}`);
    return response.data;
}

export async function actualizarProducto(id,producto,token) {
    const response = await api.put(`/api/productos/${id}`,producto,{
        headers:{ Authorization:`Bearer ${token}` }
    });
    return response.data;
}

export async function eliminarProducto(id,token) {
    await api.delete(`/api/productos/${id}`,{
        headers:{ Authorization:`Bearer ${token}` }
    });
}
