import React, { useState } from 'react';
import styles from './CartaRutina.module.css';
import jsPDF from 'jspdf';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../../../../firebase/config';
import Loading from '../../../../../../Loading/Loading';

export default function CartaRutina({ rutina, esPublica = false }) {
  const [loadingPDF, setLoadingPDF] = useState(false);

  const generarRutinaPDF = async (rutinaId, nombreRutina = 'Rutina') => {
    setLoadingPDF(true);

    const docPDF = new jsPDF();
    let y = 20;

    docPDF.setFontSize(18);
    docPDF.setTextColor(40, 40, 40);
    docPDF.setFont('helvetica', 'bold');
    docPDF.text(nombreRutina, 20, y);
    y += 10;

    const diasSnap = await getDocs(collection(db, `rutinas/${rutinaId}/Dias`));
    for (const diaDoc of diasSnap.docs) {
      const diaData = diaDoc.data();

      docPDF.setFontSize(14);
      docPDF.setTextColor(0, 102, 204);
      docPDF.setFont('helvetica', 'bold');
      docPDF.text(`${diaData.dia} - ${diaData.nombre}`, 20, y);
      y += 8;

      const ejerciciosSnap = await getDocs(collection(db, `rutinas/${rutinaId}/Dias/${diaDoc.id}/Ejercicios`));
      for (const ejercicioDoc of ejerciciosSnap.docs) {
        const ejercicioData = ejercicioDoc.data();

        const seriesSnap = await getDocs(collection(db, `rutinas/${rutinaId}/Dias/${diaDoc.id}/Ejercicios/${ejercicioDoc.id}/Series`));
        const cantidadSeries = seriesSnap.size;

        docPDF.setFontSize(11);
        docPDF.setTextColor(0);
        docPDF.setFont('helvetica', 'normal');
        docPDF.text(`• ${ejercicioData.nombre} – ${cantidadSeries} series`, 25, y);
        y += 6;
      }

      y += 6;
    }

    const pdfBlob = docPDF.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');

    setLoadingPDF(false);
  };

  const handleVerRutina = () => {
    if (!loadingPDF) {
      generarRutinaPDF(rutina.id, rutina.nombre);
    }
  };

  return (
    <div className={styles.card} onClick={handleVerRutina}>
      {loadingPDF && (
        <div className={styles.loadingOverlay}>
          <Loading />
        </div>
      )}

      <h3 className={styles.nombre}>{rutina.nombre}</h3>
      <div className={styles.acciones} onClick={(e) => e.stopPropagation()}>
        {esPublica ? (
          <button className={styles.guardar}>💾</button>
        ) : (
          <>
            <button className={styles.activar}>Activar</button>
            <button className={styles.eliminar}>❌</button>
          </>
        )}
      </div>
    </div>
  );
}
