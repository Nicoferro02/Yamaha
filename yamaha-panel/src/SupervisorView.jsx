import React, { useState, useMemo } from 'react';
import AuditoriaView from './AuditoriaView';

export default function SupervisorView({ 
  fechaPantalla, setFechaPantalla, pantallaStr, 
  operarioSemanaAnterior, operarioSemanaActual, operarioProximaSemana, operarioDelDia,
  cambiarOperarioSemana, cambiarOperarioDiario,
  agendaPorFecha, setAgendaPorFecha, notasTareas, operarios, setOperarios,
  bancoPreventivos, setBancoPreventivos, asignacionesDiarias, asignacionesSemanales
}) {
  const [subVista, setSubVista] = useState('gestion'); 
  const [editandoTareaIndex, setEditandoTareaIndex] = useState(null);
  const [seleccionIndexBanco, setSeleccionIndexBanco] = useState('');
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [itemNuevoIndex, setItemNuevoIndex] = useState('');

  const [nuevoEquipo, setNuevoEquipo] = useState('');
  const [nuevoSector, setNuevoSector] = useState('');
  const [nuevoImg, setNuevoImg] = useState(''); 
  const [nuevoExcel, setNuevoExcel] = useState('');

  // Estados Admin Operarios
  const [modalOperarios, setModalOperarios] = useState(false);
  const [nuevoOperarioNom, setNuevoOperarioNom] = useState('');

  const esFinDeSemana = fechaPantalla.getDay() === 0 || fechaPantalla.getDay() === 6;

  // Ya no usamos cálculos raros. El Dashboard te preparó el mes entero automáticamente.
  const tareasDelDia = useMemo(() => {
    if (esFinDeSemana) return [];
    return agendaPorFecha[pantallaStr] || [];
  }, [agendaPorFecha, pantallaStr, esFinDeSemana]);

  const actualizarAgendaDia = (nuevaLista) => setAgendaPorFecha(prev => ({ ...prev, [pantallaStr]: nuevaLista }));
  
  const guardarIntercambio = (index) => {
    if (seleccionIndexBanco === "") return;
    const item = bancoPreventivos[seleccionIndexBanco];
    const nuevaLista = [...tareasDelDia];
    nuevaLista[index] = { ...nuevaLista[index], eq: item.eq, cl: item.cl, img: item.img, excel: item.excel };
    actualizarAgendaDia(nuevaLista); setEditandoTareaIndex(null);
  };
  
  const agregarPreventivo = () => {
    if (itemNuevoIndex === "") return;
    const item = bancoPreventivos[itemNuevoIndex];
    const nuevaLista = [...tareasDelDia, { id: `t_${Date.now()}`, eq: item.eq, cl: item.cl, img: item.img, excel: item.excel, estado: 'Pendiente' }];
    actualizarAgendaDia(nuevaLista); setItemNuevoIndex(''); setModalAgregarAbierto(false);
  };
  
  const eliminarPreventivo = (index) => actualizarAgendaDia(tareasDelDia.filter((_, i) => i !== index));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNuevoImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const guardarNuevoPreventivo = (e) => {
    e.preventDefault();
    if (!nuevoEquipo || !nuevoSector) return alert("Falta equipo o sector");
    const imagenFinal = nuevoImg || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60';
    setBancoPreventivos([...bancoPreventivos, { eq: nuevoEquipo, cl: nuevoSector, img: imagenFinal, excel: nuevoExcel }]);
    setNuevoEquipo(''); setNuevoSector(''); setNuevoImg(''); setNuevoExcel('');
    alert("Preventivo añadido al Banco Maestro.");
  };

  const borrarDelBancoMaestro = (index) => {
    if (window.confirm("¿Eliminar este preventivo permanentemente del Banco Maestro?")) {
      setBancoPreventivos(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Gestión de Operarios Dinámica
  const agregarOperario = () => {
    if (nuevoOperarioNom.trim()) {
      setOperarios([...operarios, nuevoOperarioNom.trim()]);
      setNuevoOperarioNom('');
    }
  };
  const borrarOperario = (index) => {
    if (operarios.length === 1) return alert("Debe quedar al menos 1 operario en el sistema.");
    if (window.confirm(`¿Dar de baja a ${operarios[index]}?`)) {
      setOperarios(operarios.filter((_, i) => i !== index));
    }
  };

  const getOperarioForDate = (fechaStr) => {
    if (asignacionesDiarias[fechaStr]) return asignacionesDiarias[fechaStr];
    const [y, m, d] = fechaStr.split('-');
    const dateObj = new Date(y, m - 1, d);
    const dia = dateObj.getDay() === 0 ? 7 : dateObj.getDay();
    const lunesObj = new Date(dateObj); lunesObj.setDate(lunesObj.getDate() - dia + 1);
    const lunesKey = `${lunesObj.getFullYear()}-${String(lunesObj.getMonth() + 1).padStart(2, '0')}-${String(lunesObj.getDate()).padStart(2, '0')}`;
    if (asignacionesSemanales[lunesKey]) return asignacionesSemanales[lunesKey];
    lunesObj.setHours(0, 0, 0, 0);
    const semanas = Math.floor((lunesObj.getTime() - new Date(2024, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    return operarios.length > 0 ? operarios[((semanas % operarios.length) + operarios.length) % operarios.length] : 'Sin Personal';
  };

  const mesActualFiltro = `${fechaPantalla.getFullYear()}-${String(fechaPantalla.getMonth() + 1).padStart(2, '0')}`;
  const fallasMesActual = useMemo(() => {
    const reg = [];
    Object.entries(agendaPorFecha).forEach(([f, lista]) => {
      if (f.startsWith(mesActualFiltro)) {
        const op = getOperarioForDate(f);
        lista.forEach((t, i) => {
          const obs = notasTareas[`${f}-t-${i}-${t.eq}`];
          if (obs && obs !== 'Sin observaciones') {
            reg.push({ fecha: f, maquina: t.eq, sector: t.cl, observacion: obs, operario: op });
          }
        });
      }
    });
    return reg.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [agendaPorFecha, notasTareas, asignacionesDiarias, asignacionesSemanales, mesActualFiltro, operarios]);

  const formatearFechaDisplay = (fecha) => {
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}/${fecha.getFullYear()}`;
  };

  return (
    <main className="yamaha-main">
      <div className="supervisor-tabs-container">
        <button className={`tab-supervisor ${subVista === 'gestion' ? 'active' : ''}`} onClick={() => setSubVista('gestion')}>🛠️ Gestión Diaria y Fallas</button>
        <button className={`tab-supervisor ${subVista === 'auditoria' ? 'active' : ''}`} onClick={() => setSubVista('auditoria')}>📋 Catálogo Mensual</button>
        <button className={`tab-supervisor ${subVista === 'banco' ? 'active' : ''}`} onClick={() => setSubVista('banco')}>⚙️ Creador Maquinas</button>
      </div>

      {subVista === 'auditoria' && <AuditoriaView bancoPreventivos={bancoPreventivos} agendaPorFecha={agendaPorFecha} fechaPantalla={fechaPantalla} setFechaPantalla={setFechaPantalla} getOperarioForDate={getOperarioForDate} />}
      
      {subVista === 'banco' && (
        <div className="banco-maestro-container">
          <div className="creador-preventivo-card">
            <div className="creador-header"><h3>Crear Nuevo Preventivo</h3><p>Sube la foto del equipo y el link del Procedimiento en Excel.</p></div>
            <form onSubmit={guardarNuevoPreventivo} className="form-creador-grid">
              <div className="columna-foto">
                <label className="image-upload-box">
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  {nuevoImg ? <div className="upload-preview-container"><img src={nuevoImg} alt="Preview" className="upload-preview" /><div className="upload-overlay"><span>Cambiar foto</span></div></div> : <div className="upload-placeholder"><span className="upload-plus">+</span><span>Subir Imagen</span></div>}
                </label>
              </div>
              <div className="columna-datos">
                <div className="form-row">
                  <div className="form-group"><label>Nombre del Equipo:</label><input type="text" value={nuevoEquipo} onChange={e => setNuevoEquipo(e.target.value)} required /></div>
                  <div className="form-group"><label>Sector / Área:</label><input type="text" value={nuevoSector} onChange={e => setNuevoSector(e.target.value)} required /></div>
                </div>
                <div className="form-group" style={{marginTop: '15px'}}>
                  <label>URL del Archivo Excel (Procedimiento):</label>
                  <input type="url" value={nuevoExcel} onChange={e => setNuevoExcel(e.target.value)} placeholder="https://docs.google.com/spreadsheets/..." />
                </div>
                <button type="submit" className="btn-guardar-banco" style={{marginTop: 'auto'}}>Añadir a Base de Datos</button>
              </div>
            </form>
          </div>
          <div className="lista-banco-existente">
            <h3>Base de Datos Actual ({bancoPreventivos.length} Equipos)</h3>
            <div className="grid-preventivos mini">
              {bancoPreventivos.map((prev, idx) => (
                <div key={idx} className="card-tarea">
                  <div className="card-imagen-container"><img src={prev.img} alt={prev.eq} className="card-imagen" /><button className="btn-eliminar-card" onClick={() => borrarDelBancoMaestro(idx)}>🗑️</button></div>
                  <div className="card-body"><h3 className="equipo-titulo">{prev.eq}</h3><p className="cliente-subtitulo">{prev.cl}</p><div style={{marginTop: '10px', fontSize: '0.8rem'}}>{prev.excel ? <span style={{color: '#10B981'}}>✔ Tiene Excel</span> : <span style={{color: '#F59E0B'}}>⚠️ Sin Excel</span>}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {subVista === 'gestion' && (
        <>
          <section className="panel-timeline">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
              <h3 className="panel-title" style={{margin: 0}}>ROTACIÓN SEMANAL</h3>
              <button onClick={() => setModalOperarios(true)} className="btn-editar-link" style={{margin: 0, padding: '5px 10px', background: '#F3F4F6', borderRadius: '4px', textDecoration: 'none'}}>👥 Gestionar Personal</button>
            </div>
            <div className="timeline-boxes">
              <div className="timeline-box past"><span className="label">SEMANA ANTERIOR</span><strong>{operarioSemanaAnterior}</strong></div>
              <div className="timeline-box current"><span className="label">SEMANA ACTUAL</span><strong>{operarioSemanaActual}</strong></div>
              <div className="timeline-box future"><span className="label">PRÓXIMA SEMANA</span><strong>{operarioProximaSemana}</strong></div>
            </div>
          </section>

          {/* Modal para Administrar Operarios */}
          {modalOperarios && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Administrar Operarios</h3>
                <div className="lista-operarios-modal">
                  {operarios.map((op, i) => (
                    <div key={i} style={{display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #E5E7EB'}}>
                      <span>{op}</span>
                      <button onClick={() => borrarOperario(i)} style={{background: 'none', border: 'none', color: 'var(--y-red)', cursor: 'pointer', fontWeight: 'bold'}}>✖</button>
                    </div>
                  ))}
                </div>
                <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                  <input type="text" value={nuevoOperarioNom} onChange={e => setNuevoOperarioNom(e.target.value)} placeholder="Nombre del nuevo operario" style={{flexGrow: 1, padding: '8px', border: '1px solid var(--y-border)', borderRadius: '4px'}} />
                  <button onClick={agregarOperario} style={{background: 'var(--y-black)', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>Añadir</button>
                </div>
                <div style={{marginTop: '20px', textAlign: 'right'}}><button className="btn-cancelar" onClick={() => setModalOperarios(false)}>Cerrar</button></div>
              </div>
            </div>
          )}

          <section className="panel-control-dia">
             <div className="nav-fechas">
               <button className="btn-icon-sq" onClick={() => setFechaPantalla(new Date(fechaPantalla.getFullYear(), fechaPantalla.getMonth(), fechaPantalla.getDate() - 1))}>◀</button>
               <div className="input-fecha-wrapper">
                 <input type="text" className="input-fecha-display" value={formatearFechaDisplay(fechaPantalla)} readOnly />
                 <input type="date" className="input-fecha-hidden" value={pantallaStr} onChange={(e) => { if(e.target.value) setFechaPantalla(new Date(e.target.value + 'T00:00:00')) }}/>
               </div>
               <button className="btn-icon-sq" onClick={() => setFechaPantalla(new Date(fechaPantalla.getFullYear(), fechaPantalla.getMonth(), fechaPantalla.getDate() + 1))}>▶</button>
             </div>
             <div className="controles-supervisores-duales">
                <div className="selector-wrapper">
                  <label>TODA LA SEMANA:</label>
                  <select value={operarioSemanaActual} onChange={(e) => cambiarOperarioSemana(e.target.value)} className="select-normal">
                    {operarios.map(op => <option key={op} value={op}>{op}</option>)}
                  </select>
                </div>
                <div className="selector-wrapper">
                  <label>EXCEPCIÓN HOY:</label>
                  <select value={operarioDelDia} onChange={(e) => cambiarOperarioDiario(e.target.value)} className="select-normal">
                    {operarios.map(op => <option key={op} value={op}>{op}</option>)}
                  </select>
                </div>
             </div>
          </section>

          {!esFinDeSemana && (
            <div className="barra-acciones-dia">
              <div className="info-dia-contador">Gestión de Preventivos del Día (Automatizacion Mensual)</div>
              <button className="btn-agregar-preventivo" onClick={() => setModalAgregarAbierto(true)}>+ Asignar Tarea Manual</button>
            </div>
          )}

          {modalAgregarAbierto && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Asignar Tarea del Banco</h3>
                <select className="edicion-select" value={itemNuevoIndex} onChange={(e) => setItemNuevoIndex(e.target.value)}>
                  <option value="">-- Seleccionar equipo de la BD --</option>
                  {bancoPreventivos.map((item, idx) => <option key={idx} value={idx}>{item.eq}</option>)}
                </select>
                <div className="edicion-acciones"><button className="btn-guardar" onClick={agregarPreventivo}>Asignar Hoy</button><button className="btn-cancelar" onClick={() => setModalAgregarAbierto(false)}>Cancelar</button></div>
              </div>
            </div>
          )}

          {!esFinDeSemana && (
            <div className="grid-preventivos">
              {tareasDelDia.map((t, i) => (
                <div key={i} className={`card-tarea ${t.estado.toLowerCase()}`}>
                  <div className="card-imagen-container">
                    <img src={t.img} alt={t.eq} className="card-imagen" />
                    <span className="tarea-numero">TAREA {i + 1}</span>
                    <div className="badges-top-right">
                      <span className="badge-estado" style={{backgroundColor: t.estado === 'Completado' ? '#DCFCE7' : '#FEF3C7', color: t.estado === 'Completado' ? '#166534' : '#92400E'}}>{t.estado}</span>
                      <button className="btn-eliminar-card" onClick={() => eliminarPreventivo(i)}>🗑️</button>
                    </div>
                  </div>

                  <div className="card-body">
                    {editandoTareaIndex === i ? (
                      <div className="modo-edicion">
                        <select className="edicion-select" value={seleccionIndexBanco} onChange={(e) => setSeleccionIndexBanco(e.target.value)}>
                          <option value="">-- Cambiar --</option>
                          {bancoPreventivos.map((item, idx) => <option key={idx} value={idx}>{item.eq}</option>)}
                        </select>
                        <div className="edicion-acciones">
                          <button className="btn-guardar" onClick={() => guardarIntercambio(i)}>Guardar</button>
                          <button className="btn-cancelar" onClick={() => setEditandoTareaIndex(null)}>Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="equipo-titulo">{t.eq}</h3>
                        <p className="cliente-subtitulo">{t.cl}</p>
                        <button className="btn-editar-link" onClick={() => setEditandoTareaIndex(i)}>🔄 Cambiar Tarea</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {tareasDelDia.length === 0 && <p style={{color: '#6B7280', gridColumn: '1/-1', textAlign: 'center'}}>Día libre. No hay tareas programadas ni heredadas.</p>}
            </div>
          )}

          <div className="tabla-auditoria-container rojo" style={{marginTop: '40px'}}>
            <h3 style={{color: 'var(--y-red)', padding: '20px 20px 0 20px', margin: 0, textTransform: 'uppercase', fontSize: '1.1rem'}}>🚨 Fallas Reportadas (Mes Actual)</h3>
            <table className="tabla-auditoria">
              <thead><tr><th>Fecha</th><th>Máquina y Sector</th><th>Operario Responsable</th><th>Falla Reportada</th></tr></thead>
              <tbody>
                {fallasMesActual.length === 0 ? (
                  <tr><td colSpan="4" className="empty-table-cell">No hay fallas reportadas este mes. ¡Todo en orden!</td></tr>
                ) : (
                  fallasMesActual.map((r, i) => (
                    <tr key={i}><td><code>{r.fecha}</code></td><td><strong>{r.maquina}</strong><br/><span className="sub-sector">{r.sector}</span></td><td><span className="badge-operario">{r.operario}</span></td><td><span className="texto-observacion-tabla">⚠️ {r.observacion}</span></td></tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}