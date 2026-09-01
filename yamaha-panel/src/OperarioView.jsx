import React, { useState, useMemo } from 'react';

export default function OperarioView({ 
  fechaPantalla, setFechaPantalla, pantallaStr, 
  operarioDelDia, agendaPorFecha, setAgendaPorFecha, notasTareas, setNotasTareas
}) {
  const [notaActivaId, setNotaActivaId] = useState(null);
  const [tempNota, setTempNota] = useState('');

  const esFinDeSemana = fechaPantalla.getDay() === 0 || fechaPantalla.getDay() === 6;

  // Igual de rápido que el supervisor, todo el trabajo duro lo hizo el clonador en DashboardYamaha
  const tareasDelDia = useMemo(() => {
    if (esFinDeSemana) return [];
    return agendaPorFecha[pantallaStr] || [];
  }, [agendaPorFecha, pantallaStr, esFinDeSemana]);

  const marcarEstadoTarea = (index, nuevoEstado) => {
    const nuevaLista = [...tareasDelDia]; nuevaLista[index].estado = nuevoEstado;
    setAgendaPorFecha(prev => ({ ...prev, [pantallaStr]: nuevaLista }));
  };

  const guardarNota = (idTarea) => {
    setNotasTareas(prev => ({ ...prev, [idTarea]: tempNota }));
    setNotaActivaId(null);
  };

  const formatearFechaDisplay = (fecha) => {
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}/${fecha.getFullYear()}`;
  };

  return (
    <main className="yamaha-main">
      <div className="operario-welcome-banner">
        <div><h3>Mantenimiento Preventivos</h3><p>Responsable hoy: <strong>{operarioDelDia}</strong></p></div>
      </div>

      <section className="panel-control-dia" style={{ justifyContent: 'center' }}>
        <div className="nav-fechas">
          <button className="btn-icon-sq" onClick={() => setFechaPantalla(new Date(fechaPantalla.getFullYear(), fechaPantalla.getMonth(), fechaPantalla.getDate() - 1))}>◀</button>
          <div className="input-fecha-wrapper">
            <input type="text" className="input-fecha-display" value={formatearFechaDisplay(fechaPantalla)} readOnly />
            <input type="date" className="input-fecha-hidden" value={pantallaStr} onChange={(e) => { if(e.target.value) setFechaPantalla(new Date(e.target.value + 'T00:00:00')) }}/>
          </div>
          <button className="btn-icon-sq" onClick={() => setFechaPantalla(new Date(fechaPantalla.getFullYear(), fechaPantalla.getMonth(), fechaPantalla.getDate() + 1))}>▶</button>
        </div>
      </section>

      {esFinDeSemana ? (
        <div className="empty-state"><h3>Día de Descanso</h3></div>
      ) : (
        <div className="grid-preventivos">
          {tareasDelDia.length === 0 && <div className="empty-state" style={{gridColumn: '1/-1'}}>Día libre. No hay preventivos programados.</div>}
          
          {tareasDelDia.map((t, index) => {
            const tareaId = `${pantallaStr}-t-${index}-${t.eq}`;
            const notaActual = notasTareas[tareaId] || '';

            return (
              <div key={index} className={`card-tarea ${t.estado.toLowerCase()}`}>
                <div className="card-imagen-container">
                  <img src={t.img} alt={t.eq} className="card-imagen" />
                  <span className="tarea-numero">PREV. {index + 1}</span>
                  <div className="badges-top-right">
                    <span className="badge-estado">{t.estado}</span>
                  </div>
                </div>

                <div className="card-body">
                  <h3 className="equipo-titulo">{t.eq}</h3>
                  <p className="cliente-subtitulo">{t.cl}</p>

                  <div className="seccion-procedimiento">
                    <a href={t.excel || '#'} target="_blank" rel="noreferrer" className="btn-ver-excel">
                      {t.excel ? '📊 Ver Procedimiento en Excel' : '⚠️ Sin Archivo Excel'}
                    </a>
                  </div>

                  <div className="seccion-notas">
                    {notaActivaId === tareaId ? (
                      <div className="box-editar-nota">
                        <textarea rows="2" placeholder="Describir falla..." value={tempNota} onChange={(e) => setTempNota(e.target.value)} />
                        <div className="acciones-nota">
                          <button className="btn-save-nota" onClick={() => guardarNota(tareaId)}>Guardar Obs.</button>
                          <button className="btn-cancel-nota" onClick={() => setNotaActivaId(null)}>Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <div className="box-ver-nota" onClick={() => { setNotaActivaId(tareaId); setTempNota(notaActual); }}>
                        {notaActual ? <p className="nota-texto"><strong>📝 Falla:</strong> {notaActual}</p> : <span className="agregar-nota-link">+ Escribir falla / error</span>}
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-footer">
                  <button className="btn-marcar-ok" onClick={() => marcarEstadoTarea(index, t.estado === 'Pendiente' ? 'Completado' : 'Pendiente')}>
                    {t.estado === 'Pendiente' ? 'Marcar Completado ✔' : 'Deshacer ↺'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}