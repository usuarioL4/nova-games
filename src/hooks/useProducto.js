import { useState, useEffect } from "react";
import { obtenerProducto } from "../services/catalog";

export function useProducto(id){
    const [producto, setProducto] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let activo = true;

        async function cargarProducto(){
            setCargando(true);
            setError('');

            try{
                const respuesta = await obtenerProducto(id);
                if(activo) setProducto(respuesta);
            } catch(err){
                if(activo){
                    setProducto(null);
                    setError(err.response?.data?.message || 'Error al cargar el producto');
                }
            }finally{
                if(activo) setCargando(false);
            }
        }

        cargarProducto();
        return () => { activo = false; };
    }, [id]);

    return { producto, cargando, error };
}
