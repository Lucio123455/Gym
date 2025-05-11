export const formatearFecha = (fecha) => {
    if (!fecha) return '00/00/00';

    let dateObj;
    try {
        dateObj = typeof fecha.toDate === 'function' ? fecha.toDate() : new Date(fecha);
        if (isNaN(dateObj.getTime())) throw new Error('Invalid date');
    } catch {
        return '00/00/00';
    }

    const ahora = new Date();
    const esHoy =
        dateObj.getDate() === ahora.getDate() &&
        dateObj.getMonth() === ahora.getMonth() &&
        dateObj.getFullYear() === ahora.getFullYear();

    return esHoy
        ? dateObj.toLocaleTimeString('es-AR', {
            hour: 'numeric',
            minute: '2-digit',
        })
        : dateObj.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
        });
};
