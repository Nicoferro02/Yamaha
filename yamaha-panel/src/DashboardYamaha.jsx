import React, { useState, useEffect } from 'react';
import LoginView from './LoginView';
import OperarioView from './OperarioView';
import SupervisorView from './SupervisorView';
import './DashboardYamaha.css';

const BANCO_INICIAL = [
  { eq: 'Generador Serie MZ - Planta Alta', cl: 'Sector Producción', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: 'https://docs.google.com/spreadsheets/' },
  { eq: 'Motor Marino F70 - Revisión 100hs', cl: 'Depósito Logística', img: 'https://images.unsplash.com/photo-1625218050604-03a1fc6c905b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: 'https://docs.google.com/spreadsheets/' },
  { eq: 'Compresor Taller Central', cl: 'Sector Ensamblaje', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '' },
  { eq: 'Autoelevador Yamaha #1 - Frenos', cl: 'Almacén de Repuestos', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', excel: '' }
];
const OP_INICIALES = ['Mauro Barrios', 'Julian Janowicz', 'Gabriel Gonzales', 'Axel Dominguez', 'Ferro Nicolas'];

const leerDatosSeguros = (key, valorPorDefecto = {}) => {
  try { const data = localStorage.getItem(key); return data ? JSON.parse(data) : valorPorDefecto; } 
  catch (error) { return valorPorDefecto; }
};

export default function DashboardYamaha() {
  const [currentUser, setCurrentUser] = useState(() => leerDatosSeguros('yamaha_auth_user_v13', null));
  const [fechaPantalla, setFechaPantalla] = useState(new Date());

  const [operarios, setOperarios] = useState(() => leerDatosSeguros('yamaha_operarios_v13', OP_INICIALES));
  const [bancoPreventivos, setBancoPreventivos] = useState(() => leerDatosSeguros('yamaha_banco_v13', BANCO_INICIAL));
  const [asignacionesSemanales, setAsignacionesSemanales] = useState(() => leerDatosSeguros('yamaha_semanales_v13'));
  const [asignacionesDiarias, setAsignacionesDiarias] = useState(() => leerDatosSeguros('yamaha_diarias_v13'));
  const [agendaPorFecha, setAgendaPorFecha] = useState(() => leerDatosSeguros('yamaha_agenda_v13'));
  const [notasTareas, setNotasTareas] = useState(() => leerDatosSeguros('yamaha_notas_v13'));

  useEffect(() => {
    localStorage.setItem('yamaha_auth_user_v13', JSON.stringify(currentUser));
    localStorage.setItem('yamaha_operarios_v13', JSON.stringify(operarios));
    localStorage.setItem('yamaha_banco_v13', JSON.stringify(bancoPreventivos));
    localStorage.setItem('yamaha_semanales_v13', JSON.stringify(asignacionesSemanales));
    localStorage.setItem('yamaha_diarias_v13', JSON.stringify(asignacionesDiarias));
    localStorage.setItem('yamaha_agenda_v13', JSON.stringify(agendaPorFecha));
    localStorage.setItem('yamaha_notas_v13', JSON.stringify(notasTareas));
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