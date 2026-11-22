import { useState, useEffect, useCallback } from "react";
import { listarComentarios } from "../services/comunidad";

export function useComentarios(){
    const [comentarios, setComentarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const recargarComentarios = useCallback(async () => {
        setCargando(true);
        setError('');

        try{
            const respuesta = await listarComentarios();
            setComentarios(respuesta);
        } catch(err){
            setError(err.response?.data?.message || 'Error al cargar los comentarios');
        }finally{
            setCargando(false);
        }
    },[]);

    useEffect(() => {
        recargarComentarios();
    }, [recargarComentarios]);

    return { comentarios, cargando, error, recargarComentarios };
}
