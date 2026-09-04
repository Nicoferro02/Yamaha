import React, { useState, useEffect } from 'react';
import LoginView from './LoginView';
import OperarioView from './OperarioView';
import SupervisorView from './SupervisorView';
import './DashboardYamaha.css';

  const BANCO_INICIAL = [
  { eq: 'Línea A (Panel, Fuerza Motriz, Clamps).', cl: 'Producción', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=6' },
  { eq: 'Marcadora Línea A', cl: 'Producción', img: 'https://images.unsplash.com/photo-1625218050604-03a1fc6c905b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=7' },
  { eq: 'Prensa Línea A', cl: 'Producción', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=8' },
  { eq: 'Brazo Ingrávido DALMEC No.3', cl: 'Producción', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=9' },
  { eq: 'Inyectora de liquido de freno N°1', cl: 'Producción', img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=10' },
  { eq: 'Inyectora de liquido de freno ABS', cl: 'Producción', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=11' },
  { eq: 'Inyectora Refrigerante', cl: 'Producción', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=12' },
  { eq: 'Máquina Inyectora de Combustible N°1(Neumática)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1625218050604-03a1fc6c905b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=13' },
  { eq: 'Dinamometro A', cl: 'Producción', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=14' },
  { eq: 'Plataformas Lextral.', cl: 'Producción', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=15' },
  { eq: 'Línea de producción (Línea A)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=16' },
  { eq: 'Línea B (Fuerza Motriz y Central Hidráulica).', cl: 'Producción', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=17' },
  { eq: 'Prensa No.2', cl: 'Producción', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=18' },
  { eq: 'Marcadora B (telesis TMP3200/TMC420)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1625218050604-03a1fc6c905b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=19' },
  { eq: 'Marcadora portatil', cl: 'Producción', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=20' },
  { eq: 'Brazo Ingrávido DALMEC No.2', cl: 'Producción', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=21' },
  { eq: 'Brazo Ingrávido RAKU-RAKU', cl: 'Producción', img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=22' },
  { eq: 'Máquina Inyectora de Líquido de Frenos N°2', cl: 'Producción', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=23' },
  { eq: 'Máquina Inyectora de Combustible N°2 (Eléctrica)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=24' },
  { eq: 'Tanque de Traspaso de Combustible', cl: 'Producción', img: 'https://images.unsplash.com/photo-1625218050604-03a1fc6c905b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=25' },
  { eq: 'Aparejo (Descenso de unidades línea)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=26' },
  { eq: 'Carros de Línea B (Piezas, MC y Clamps)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=27' },
  { eq: 'Línea de producción (Línea B)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=28' },
  { eq: 'FR de Linea B', cl: 'Producción', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=29' },
  { eq: 'Banco de Baterías', cl: 'Producción', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=30' },
  { eq: 'Dinamómetro B', cl: 'Producción', img: 'https://images.unsplash.com/photo-1625218050604-03a1fc6c905b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=31' },
  { eq: 'Dinamómetro ATV', cl: 'Producción', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=32' },
  { eq: 'Prensa Ruedas (Neumática)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=34' },
  { eq: 'Prensa No.1', cl: 'Producción', img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=35' },
  { eq: 'Prensa ATV', cl: 'Producción', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=36' },
  { eq: 'Prensa Horquillones 1', cl: 'Producción', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=37' },
  { eq: 'Prensa Horquillones 2', cl: 'Producción', img: 'https://images.unsplash.com/photo-1625218050604-03a1fc6c905b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=38' },
  { eq: 'Plataforma AlmatecCKD Horquillas', cl: 'Producción', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=39' },
  { eq: 'Plataforma de ruedas CKD', cl: 'Producción', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=40' },
  { eq: 'Plataforma AlmatecCKD  Motores', cl: 'Producción', img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=41' },
  { eq: 'Brazo Ingrávido DALMEC No.1', cl: 'Producción', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=42' },
  { eq: 'Carro Motores', cl: 'Producción', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=43' },
  { eq: 'Dispositivos de equipos de izaje (Ganchos y Eslingas)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1625218050604-03a1fc6c905b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=44' },
  { eq: 'BER 1 Plataforma Elevadoras de MC (Reparaciones)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=46' },
  { eq: 'BER 2 Plataforma Elevadoras de MC (Reparaciones)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=47' },
  { eq: 'BER 3 Plataforma Elevadoras de MC (Reparaciones)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=48' },
  { eq: 'Máquina Succionadora de Combustible  2', cl: 'Producción', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=49' },
  { eq: 'BEL Plataforma Elevadoras de MC (1) (Packing)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=50' },
  { eq: 'BEC 1 Plataforma Elevadoras de MC (Sala Endurance Test)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1625218050604-03a1fc6c905b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=51' },
  { eq: 'BEC 2 Plataforma Elevadoras de MC(Sala Endurance Test)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=52' },
  { eq: 'Auto elevador No.5 (Y)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=53' },
  { eq: 'Auto elevador No.7 (T)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=54' },
  { eq: 'Auto elevador No.9 (Y)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=55' },
  { eq: 'Auto elevador No.10 (Y) (Ex autoelevador 1)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=56' },
  { eq: 'Apiladora Eléctrica No.1 (Y)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1625218050604-03a1fc6c905b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=57' },
  { eq: 'Apiladora Eléctrica No.2 (Y)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=58' },
  { eq: 'Cargador de Baterías Apliladores N°1 y N°2.', cl: 'Producción', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=59' },
  { eq: 'Enfardadoras 1', cl: 'Producción', img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=60' },
  { eq: 'Enfardadoras 2', cl: 'Producción', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=61' },
  { eq: 'Aparejo Pórtico', cl: 'Producción', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=62' },
  { eq: 'Plataforma de descarga de contenedores (Eléctrica)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1625218050604-03a1fc6c905b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=63' },
  { eq: 'Plataforma de descarga de contenedores (Hidráulica)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=64' },
  { eq: 'Sistemas de Almacenamiento (tanques Gas-oil x 2 y nafta, bombas de impulsión y sistema de carga, cañerías)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=65' },
  { eq: 'Apilador hidráulico Manual (Cantidad 3)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=66' },
  { eq: 'Aparejo de taller de mantenimiento no esta en vigencia', cl: 'Producción', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=81' },
  { eq: 'Aparejo manual de servicio técnico', cl: 'Producción', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=83' },
  { eq: 'Plataforma Almatec ATV', cl: 'Producción', img: 'https://images.unsplash.com/photo-1625218050604-03a1fc6c905b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=84' },
  { eq: 'Bandera de chasis (CKD) 1', cl: 'Producción', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=85' },
  { eq: 'Bandera de chasis (CKD) 2 no esta en vigencia', cl: 'Producción', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=86' },
  { eq: 'Herramientas eléctricas Angulares', cl: 'Producción', img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=88' },
  { eq: 'Sala de Compresores (Sist. de Filtrado, Pulmones, Secadores)', cl: 'Producción', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '/Planillas de Inspección PAM productivo 2025 _2.xlsx#sheet=90' }

];
const OP_INICIALES = ['Mauro Barrios', 'Julian Janowicz', 'Gabriel Gonzales', 'Axel Dominguez', 'Ferro Nicolas'];

const leerDatosSeguros = (key, valorPorDefecto = {}) => {
  try { const data = localStorage.getItem(key); return data ? JSON.parse(data) : valorPorDefecto; } 
  catch (error) { return valorPorDefecto; }
};

export default function DashboardYamaha() {
  const [currentUser, setCurrentUser] = useState(() => leerDatosSeguros('yamaha_auth_user_v14', null));
  const [fechaPantalla, setFechaPantalla] = useState(new Date());

  const [operarios, setOperarios] = useState(() => leerDatosSeguros('yamaha_operarios_v14', OP_INICIALES));
  const [bancoPreventivos, setBancoPreventivos] = useState(() => leerDatosSeguros('yamaha_banco_v14', BANCO_INICIAL));
  const [asignacionesSemanales, setAsignacionesSemanales] = useState(() => leerDatosSeguros('yamaha_semanales_v14'));
  const [asignacionesDiarias, setAsignacionesDiarias] = useState(() => leerDatosSeguros('yamaha_diarias_v14'));
  const [agendaPorFecha, setAgendaPorFecha] = useState(() => leerDatosSeguros('yamaha_agenda_v14'));
  const [notasTareas, setNotasTareas] = useState(() => leerDatosSeguros('yamaha_notas_v14'));

  useEffect(() => {
    localStorage.setItem('yamaha_auth_user_v14', JSON.stringify(currentUser));
    localStorage.setItem('yamaha_operarios_v14', JSON.stringify(operarios));
    localStorage.setItem('yamaha_banco_v14', JSON.stringify(bancoPreventivos));
    localStorage.setItem('yamaha_semanales_v14', JSON.stringify(asignacionesSemanales));
    localStorage.setItem('yamaha_diarias_v14', JSON.stringify(asignacionesDiarias));
    localStorage.setItem('yamaha_agenda_v14', JSON.stringify(agendaPorFecha));
    localStorage.setItem('yamaha_notas_v14', JSON.stringify(notasTareas));
  }, [currentUser, operarios, bancoPreventivos, asignacionesSemanales, asignacionesDiarias, agendaPorFecha, notasTareas]);

  // 🤖 MOTOR DE AUTOMATIZACIÓN MENSUAL (CLONADO INTELIGENTE POR DÍAS HÁBILES)
  useEffect(() => {
    const currentYear = fechaPantalla.getFullYear();
    const currentMonth = fechaPantalla.getMonth();
    const strMesActual = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}`;
    
    setAgendaPorFecha(prevAgenda => {
      const yaTieneTareasEsteMes = Object.keys(prevAgenda).some(k => k.startsWith(strMesActual));
      if (yaTieneTareasEsteMes) return prevAgenda; // Si ya armaste el mes, no lo pisa.

      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const strMesPasado = `${prevYear}-${String(prevMonth+1).padStart(2,'0')}`;
      
      const tareasPrev = Object.keys(prevAgenda).filter(k => k.startsWith(strMesPasado));
      if (tareasPrev.length === 0) return prevAgenda; // Si el mes pasado no tenía nada, cancela.

      const nuevaAgenda = { ...prevAgenda };
      let huboClonado = false;
      let diaHabilActual = 0;

      // Recorremos los días de este mes
      for (let i = 1; i <= 31; i++) {
        const dActual = new Date(currentYear, currentMonth, i);
        if (dActual.getMonth() !== currentMonth) break;
        
        if (dActual.getDay() !== 0 && dActual.getDay() !== 6) { // Solo días hábiles
          diaHabilActual++;
          let diaHabilPrev = 0;
          
          // Buscamos el MISMO DÍA HÁBIL en el mes pasado
          for (let j = 1; j <= 31; j++) {
            const dPrev = new Date(prevYear, prevMonth, j);
            if (dPrev.getMonth() !== prevMonth) break;
            
            if (dPrev.getDay() !== 0 && dPrev.getDay() !== 6) {
              diaHabilPrev++;
              if (diaHabilPrev === diaHabilActual) {
                const keyPrev = `${dPrev.getFullYear()}-${String(dPrev.getMonth()+1).padStart(2,'0')}-${String(dPrev.getDate()).padStart(2,'0')}`;
                if (nuevaAgenda[keyPrev] && nuevaAgenda[keyPrev].length > 0) {
                  const keyActual = `${dActual.getFullYear()}-${String(dActual.getMonth()+1).padStart(2,'0')}-${String(dActual.getDate()).padStart(2,'0')}`;
                  // Clona la tarea pero resetea el estado a Pendiente!
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
          <button className="btn-logout" onClick={() => { setCurrentUser(null); localStorage.removeItem('yamaha_auth_user_v13'); }}>Salir ⎋</button>
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