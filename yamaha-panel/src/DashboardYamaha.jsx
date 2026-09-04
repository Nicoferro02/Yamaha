import React, { useState, useEffect } from 'react';
import LoginView from './LoginView';
import OperarioView from './OperarioView';
import SupervisorView from './SupervisorView';
import './DashboardYamaha.css';

const BANCO_INICIAL = [
  { eq: 'Línea A (Panel, Fuerza Motriz, Clamps).', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Marcadora Línea A', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1625218050604-03a1fc6c905b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Prensa Línea A', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Brazo Ingrávido DALMEC No.3', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Inyectora de liquido de freno N°1', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Inyectora de liquido de freno ABS', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Inyectora Refrigerante', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Máquina Inyectora de Combustible N°1(Neumática)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1625218050604-03a1fc6c905b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Dinamometro A', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Plataformas Lextral.', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Línea de producción (Línea A)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Línea B (Fuerza Motriz y Central Hidráulica).', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Prensa No.2', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Marcadora B (telesis TMP3200/TMC420)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1625218050604-03a1fc6c905b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Marcadora portatil', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Brazo Ingrávido DALMEC No.2', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Brazo Ingrávido RAKU-RAKU', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Máquina Inyectora de Líquido de Frenos N°2', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Máquina Inyectora de Combustible N°2 (Eléctrica)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Tanque de Traspaso de Combustible', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1625218050604-03a1fc6c905b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Aparejo (Descenso de unidades línea)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Carros de Línea B (Piezas, MC y Clamps)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Línea de producción (Línea B)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'FR de Linea B', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Banco de Baterías', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Dinamómetro B', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1625218050604-03a1fc6c905b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Dinamómetro ATV', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Prensa Ruedas (Neumática)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Prensa No.1', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Prensa ATV', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Prensa Horquillones 1', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Prensa Horquillones 2', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1625218050604-03a1fc6c905b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Plataforma AlmatecCKD Horquillas', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Plataforma de ruedas CKD', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Plataforma AlmatecCKD  Motores', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Brazo Ingrávido DALMEC No.1', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Carro Motores', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Dispositivos de equipos de izaje (Ganchos y Eslingas)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1625218050604-03a1fc6c905b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'BER 1 Plataforma Elevadoras de MC (Reparaciones)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'BER 2 Plataforma Elevadoras de MC (Reparaciones)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'BER 3 Plataforma Elevadoras de MC (Reparaciones)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Máquina Succionadora de Combustible  2', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'BEL Plataforma Elevadoras de MC (1) (Packing)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'BEC 1 Plataforma Elevadoras de MC (Sala Endurance Test)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1625218050604-03a1fc6c905b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'BEC 2 Plataforma Elevadoras de MC(Sala Endurance Test)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Auto elevador No.5 (Y)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Auto elevador No.7 (T)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Auto elevador No.9 (Y)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Auto elevador No.10 (Y) (Ex autoelevador 1)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Apiladora Eléctrica No.1 (Y)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1625218050604-03a1fc6c905b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Apiladora Eléctrica No.2 (Y)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Cargador de Baterías Apliladores N°1 y N°2.', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Enfardadoras 1', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Enfardadoras 2', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Aparejo Pórtico', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Plataforma de descarga de contenedores (Eléctrica)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1625218050604-03a1fc6c905b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Plataforma de descarga de contenedores (Hidráulica)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Sistemas de Almacenamiento (tanques Gas-oil x 2 y nafta, bombas de impulsión y sistema de carga, cañerías)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Apilador hidráulico Manual (Cantidad 3)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Aparejo de taller de mantenimiento no esta en vigencia', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Aparejo manual de servicio técnico', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Plataforma Almatec ATV', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1625218050604-03a1fc6c905b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Bandera de chasis (CKD) 1', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Bandera de chasis (CKD) 2 no esta en vigencia', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Herramientas eléctricas Angulares', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' },
  { eq: 'Sala de Compresores (Sist. de Filtrado, Pulmones, Secadores)', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx' }
];

const OP_INICIALES = ['Mauro Barrios', 'Julian Janowicz', 'Gabriel Gonzales', 'Axel Dominguez', 'Ferro Nicolas'];

const leerDatosSeguros = (key, valorPorDefecto = {}) => {
  try { const data = localStorage.getItem(key); return data ? JSON.parse(data) : valorPorDefecto; } 
  catch (error) { return valorPorDefecto; }
};

export default function DashboardYamaha() {
  const [currentUser, setCurrentUser] = useState(() => leerDatosSeguros('yamaha_auth_user_v15', null));
  const [fechaPantalla, setFechaPantalla] = useState(new Date());

  const [operarios, setOperarios] = useState(() => leerDatosSeguros('yamaha_operarios_v15', OP_INICIALES));
  const [bancoPreventivos, setBancoPreventivos] = useState(() => leerDatosSeguros('yamaha_banco_v15', BANCO_INICIAL));
  const [asignacionesSemanales, setAsignacionesSemanales] = useState(() => leerDatosSeguros('yamaha_semanales_v15'));
  const [asignacionesDiarias, setAsignacionesDiarias] = useState(() => leerDatosSeguros('yamaha_diarias_v15'));
  const [agendaPorFecha, setAgendaPorFecha] = useState(() => leerDatosSeguros('yamaha_agenda_v15'));
  const [notasTareas, setNotasTareas] = useState(() => leerDatosSeguros('yamaha_notas_v15'));

  useEffect(() => {
    localStorage.setItem('yamaha_auth_user_v15', JSON.stringify(currentUser));
    localStorage.setItem('yamaha_operarios_v15', JSON.stringify(operarios));
    localStorage.setItem('yamaha_banco_v15', JSON.stringify(bancoPreventivos));
    localStorage.setItem('yamaha_semanales_v15', JSON.stringify(asignacionesSemanales));
    localStorage.setItem('yamaha_diarias_v15', JSON.stringify(asignacionesDiarias));
    localStorage.setItem('yamaha_agenda_v15', JSON.stringify(agendaPorFecha));
    localStorage.setItem('yamaha_notas_v15', JSON.stringify(notasTareas));
  }, [currentUser, operarios, bancoPreventivos, asignacionesSemanales, asignacionesDiarias, agendaPorFecha, notasTareas]);

  // 🤖 MOTOR DE AUTOMATIZACIÓN MENSUAL (CLONADO INTELIGENTE POR DÍAS HÁBILES)
  useEffect(() => {
    const currentYear = fechaPantalla.getFullYear();
    const currentMonth = fechaPantalla.getMonth();
    const strMesActual = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}`;
    
    setAgendaPorFecha(prevAgenda => {
      const yaTieneTareasEsteMes = Object.keys(prevAgenda).some(k => k.startsWith(strMesActual));
      if (yaTieneTareasEsteMes) return prevAgenda;

      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const strMesPasado = `${prevYear}-${String(prevMonth+1).padStart(2,'0')}`;
      
      const tareasPrev = Object.keys(prevAgenda).filter(k => k.startsWith(strMesPasado));
      if (tareasPrev.length === 0) return prevAgenda;

      const nuevaAgenda = { ...prevAgenda };
      let huboClonado = false;
      let diaHabilActual = 0;

      for (let i = 1; i <= 31; i++) {
        const dActual = new Date(currentYear, currentMonth, i);
        if (dActual.getMonth() !== currentMonth) break;
        
        if (dActual.getDay() !== 0 && dActual.getDay() !== 6) {
          diaHabilActual++;
          let diaHabilPrev = 0;
          
          for (let j = 1; j <= 31; j++) {
            const dPrev = new Date(prevYear, prevMonth, j);
            if (dPrev.getMonth() !== prevMonth) break;
            
            if (dPrev.getDay() !== 0 && dPrev.getDay() !== 6) {
              diaHabilPrev++;
              if (diaHabilPrev === diaHabilActual) {
                const keyPrev = `${dPrev.getFullYear()}-${String(dPrev.getMonth()+1).padStart(2,'0')}-${String(dPrev.getDate()).padStart(2,'0')}`;
                if (nuevaAgenda[keyPrev] && nuevaAgenda[keyPrev].length > 0) {
                  const keyActual = `${dActual.getFullYear()}-${String(dActual.getMonth()+1).padStart(2,'0')}-${String(dActual.getDate()).padStart(2,'0')}`;
                  nuevaAgenda[keyActual] = nuevaAgenda[keyPrev].map(t => ({...t, estado: 'Pendiente'}));
                  huboClonado = true;
                }
                break;
              }
            }
          }
        }
      }
      return huboClonado ? nuevaAgenda : prevAgenda;
    });
  }, [fechaPantalla.getFullYear(), fechaPantalla.getMonth()]); 

  if (!currentUser) return <LoginView onLogin={(user) => setCurrentUser(user)} />;

  const getLunesSemana = (fecha) => {
    const d = new Date(fecha);
    const dia = d.getDay() === 0 ? 7 : d.getDay();
    d.setDate(d.getDate() - dia + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getOperarioSemanaMatematico = (fecha) => {
    if (!operarios || operarios.length === 0) return 'Sin Personal';
    const d = new Date(fecha);
    const dia = d.getDay() === 0 ? 7 : d.getDay();
    d.setDate(d.getDate() - dia + 1); d.setHours(0, 0, 0, 0);
    const semanas = Math.floor((d.getTime() - new Date(2024, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    return operarios[((semanas % operarios.length) + operarios.length) % operarios.length];
  };

  const getOperarioPorSemana = (fecha, offset = 0) => {
    const d = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + (offset * 7));
    return asignacionesSemanales[getLunesSemana(d)] || getOperarioSemanaMatematico(d);
  };

  const pantallaStr = `${fechaPantalla.getFullYear()}-${String(fechaPantalla.getMonth() + 1).padStart(2, '0')}-${String(fechaPantalla.getDate()).padStart(2, '0')}`;
  const operarioDelDia = asignacionesDiarias[pantallaStr] || getOperarioPorSemana(fechaPantalla, 0);

  const mesActualStr = `${fechaPantalla.getFullYear()}-${String(fechaPantalla.getMonth() + 1).padStart(2, '0')}`;
  let tareasMes = 0; let completadosMes = 0;
  Object.keys(agendaPorFecha).forEach(key => {
    if (key.startsWith(mesActualStr)) {
      agendaPorFecha[key].forEach(t => { 
        tareasMes++; if (t.estado === 'Completado') completadosMes++; 
      });
    }
  });

  return (
    <div className="yamaha-container">
      <header className="yamaha-header">
        <div className="header-titles">
          <h1>YAMAHA MOTOR ARGENTINA</h1>
          <h2>GESTIÓN INDUSTRIAL</h2>
        </div>
        <div className="header-user-info">
          <div className="user-badge-role">👤 <strong>{currentUser.name}</strong></div>
          <button className="btn-logout" onClick={() => { setCurrentUser(null); localStorage.removeItem('yamaha_auth_user_v15'); }}>Salir ⎋</button>
        </div>
        <div className="resumen-ejecutivo">
          <span>META DEL MES: {completadosMes} / {tareasMes || 1}</span>
          <div className="progress-mini"><div style={{ width: `${Math.min((completadosMes / (tareasMes || 1)) * 100, 100)}%` }}></div></div>
        </div>
      </header>

      {currentUser.role === 'operario' ? (
        <OperarioView 
          fechaPantalla={fechaPantalla} setFechaPantalla={setFechaPantalla} pantallaStr={pantallaStr}
          operarioDelDia={operarioDelDia} agendaPorFecha={agendaPorFecha} setAgendaPorFecha={setAgendaPorFecha}
          notasTareas={notasTareas} setNotasTareas={setNotasTareas} bancoPreventivos={bancoPreventivos}
        />
      ) : (
        <SupervisorView 
          fechaPantalla={fechaPantalla} setFechaPantalla={setFechaPantalla} pantallaStr={pantallaStr}
          operarioSemanaAnterior={getOperarioPorSemana(fechaPantalla, -1)}
          operarioSemanaActual={getOperarioPorSemana(fechaPantalla, 0)}
          operarioProximaSemana={getOperarioPorSemana(fechaPantalla, 1)}
          operarioDelDia={operarioDelDia}
          cambiarOperarioSemana={(op) => setAsignacionesSemanales(p => ({...p, [getLunesSemana(fechaPantalla)]: op}))}
          cambiarOperarioDiario={(op) => setAsignacionesDiarias(p => ({...p, [pantallaStr]: op}))}
          agendaPorFecha={agendaPorFecha} setAgendaPorFecha={setAgendaPorFecha}
          notasTareas={notasTareas} operarios={operarios} setOperarios={setOperarios}
          bancoPreventivos={bancoPreventivos} setBancoPreventivos={setBancoPreventivos}
          asignacionesDiarias={asignacionesDiarias} asignacionesSemanales={asignacionesSemanales}
        />
      )}
    </div>
  );
}