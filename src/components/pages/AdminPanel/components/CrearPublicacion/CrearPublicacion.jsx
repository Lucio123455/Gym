import React, { useState } from 'react';
import { useAuth } from '../../../../../hooks/useAuth';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../../../firebase/config';
import styles from './CrearPublicacion.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CrearPublicacion() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        descripcion: '',
        imagenUrl: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const nuevaPublicacion = {
                descripcion: formData.descripcion,
                imagen: formData.imagenUrl,
                fecha: new Date().toISOString(), // Fecha y hora completa
                autor: user.email,
                likes: 0,
                comentarios: []
            };

            await addDoc(collection(db, 'Publicaciones'), nuevaPublicacion);

            toast.success('Publicación creada exitosamente!');
            setFormData({
                descripcion: '',
                imagenUrl: ''
            });
        } catch (err) {
            console.error("Error al crear publicación:", err);
            toast.error('Error al crear la publicación');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Crear Nueva Publicación</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="descripcion">Descripción:</label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        required
                        rows={4}
                        disabled={isSubmitting}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="imagenUrl">URL de la Imagen:</label>
                    <input
                        id="imagenUrl"
                        type="url"
                        name="imagenUrl"
                        placeholder="https://ejemplo.com/mi-imagen.jpg"
                        value={formData.imagenUrl}
                        onChange={handleChange}
                        disabled={isSubmitting}
                    />
                    {formData.imagenUrl && (
                        <div className={styles.imagePreview}>
                            <img src={formData.imagenUrl} alt="Vista previa" />
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.submitButton}
                >
                    {isSubmitting ? 'Publicando...' : 'Crear Publicación'}
                </button>
            </form>
        </div>
    );
}
