import { useState, useEffect, useCallback } from "react";
import { listarProductos } from "../services/catalog";

export function useProductos(){
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');


    const recargarProductos = useCallback(async () => {
        setCargando(true);
        setError('');

        try{
            const respuesta = await listarProductos();
            setProductos(respuesta);
        } catch(err){
            setError(err.response?.data?.message || 'Error al cargar productos');
        }finally{
            setCargando(false);
        }
    },[]);
useEffect(() => {
    recargarProductos();
    }, [recargarProductos]);

    return { productos, cargando, error,recargarProductos};
}