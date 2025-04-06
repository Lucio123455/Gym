import React from 'react';
import Publicacion from '../Publicacion/Publicacion';
import publi1 from '../../../../../assets/publicacion1.jpg';
import publi2 from '../../../../../assets/publicacion2.jpg';

const publicaciones = [
    {
        id: 1,
        imagen: publi1,
        descripcion: "¡Nueva clase de yoga los lunes y miércoles a las 8 AM!",
        likes: 24,
        fecha: "2023-11-15",
        comentarios: [
            "¡Genial! ¿Habrá clases los viernes también?",
            "Yo me apunto ✨"
        ],
        autor: "Gimnasio Power"
    },
    {
        id: 2,
        imagen: publi2,
        descripcion: "20% de descuento en paquetes de musculación.",
        likes: 42,
        fecha: "2023-11-10",
        comentarios: [
            "¿El descuento aplica para estudiantes?",
            "Justo lo que necesitaba 💪"
        ],
        autor: "Gimnasio Power"
    },
];

function Publicaciones() {
    return (
        <div>
            {publicaciones.map((publicacion) => (
                <Publicacion key={publicacion.id} publicacion={publicacion} />
            ))}
        </div>
    );
}


export default Publicaciones;