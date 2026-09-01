export const OPERARIOS = [
  'Mauro Barrios', 'Julian Janowicz', 'Gabriel Gonzales', 'Axel Dominguez', 'Ferro Nicolas'
];

export const BANCO_PREVENTIVOS = [
  { eq: 'Generador Serie MZ - Planta Alta', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { eq: 'Motor Marino F70 - Revisión 100hs', cl: 'Depósito Logística', img: 'https://images.unsplash.com/photo-1625218050604-03a1fc6c905b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { eq: 'Compresor Taller Central', cl: 'Sector Ensamblaje', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { eq: 'Autoelevador Yamaha #1 - Frenos', cl: 'Almacén de Repuestos', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { eq: 'Autoelevador Yamaha #2 - Sist. Hidráulico', cl: 'Sector Carga', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { eq: 'Cinta Transportadora A1', cl: 'Línea de Ensamblaje', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' }
];

export const obtenerFechaLocal = (fecha) => {
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
};