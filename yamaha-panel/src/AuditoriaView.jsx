import React, { useState, useMemo } from 'react';

export default function AuditoriaView({ bancoPreventivos, agendaPorFecha, fechaPantalla, setFechaPantalla, getOperarioForDate }) {
  const [filtroTexto, setFiltroTexto] = useState('');

  const mesSeleccionado = `${fechaPantalla.getFullYear()}-${String(fechaPantalla.getMonth() + 1).padStart(2, '0')}`;
  
  // Función para determinar si el equipo se hizo ESTE MES y QUIÉN LO HIZO
  const getEstadoMensual = (nombreEquipo) => {
    let ultimoEstado = 'No Programado';
    let fechaCompletado = '-';
    let operarioAsignado = '-';

    // Ordenamos cronológicamente para obtener siempre el último registro del mes
    const fechasDelMes = Object.keys(agendaPorFecha)
      .filter(k => k.startsWith(mesSeleccionado))
      .sort();

    fechasDelMes.forEach(fechaKey => {
      const tareaEncontrada = agendaPorFecha[fechaKey].find(t => t.eq === nombreEquipo);
      if (tareaEncontrada) {
        ultimoEstado = tareaEncontrada.estado;
        fechaCompletado = fechaKey;
        // Obtenemos al responsable utilizando la función del Supervisor
        operarioAsignado = getOperarioForDate(fechaKey); 
      }
    });

    return { estado: ultimoEstado, fecha: fechaCompletado, operario: operarioAsignado };
  };

  const listaFiltrada = useMemo(() => {
    if (!filtroTexto) return bancoPreventivos;
    return bancoPreventivos.filter(r => 
      r.eq.toLowerCase().includes(filtroTexto.toLowerCase()) || 
      r.cl.toLowerCase().includes(filtroTexto.toLowerCase())
    );
  }, [bancoPreventivos, filtroTexto]);

  return (
    <div className="auditoria-view-container">
      <div className="supervisor-header-panel" style={{marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px'}}>
        <div>
          <h2 style={{margin: '0 0 5px 0'}}>Catálogo de Preventivos</h2>
          <p style={{margin: '0', color: '#6B7280'}}>El estado de la lista se reinicia automáticamente cada mes.</p>
        </div>
        
        <div style={{background: 'white', padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--y-border)', display: 'flex', alignItems: 'center', gap: '10px'}}>
          <span style={{fontSize: '0.85rem', fontWeight: 'bold'}}>Viendo el mes de:</span>
          <button className="btn-icon-sq" style={{width: '28px', height: '28px'}} onClick={() => setFechaPantalla(new Date(fechaPantalla.getFullYear(), fechaPantalla.getMonth() - 1, 1))}>◀</button>
          <strong style={{color: 'var(--y-red)'}}>{mesSeleccionado}</strong>
          <button className="btn-icon-sq" style={{width: '28px', height: '28px'}} onClick={() => setFechaPantalla(new Date(fechaPantalla.getFullYear(), fechaPantalla.getMonth() + 1, 1))}>▶</button>
        </div>
      </div>

      <div className="filtro-maquina-container" style={{marginBottom: '20px'}}>
        <input 
          type="text" 
          placeholder="🔍 Buscar máquina en la base de datos..." 
          value={filtroTexto} 
          onChange={(e) => setFiltroTexto(e.target.value)} 
          className="input-filtro-supervisor" 
          style={{padding: '12px', width: '350px', borderRadius: '4px', border: '1px solid var(--y-border)'}}
        />
      </div>

      <div className="tabla-auditoria-container">
        <table className="tabla-auditoria">
          <thead>
            <tr>
              <th>Nombre del Equipo / Máquina</th>
              <th>Sector</th>
              <th>Documento</th>
              <th>Estado ({mesSeleccionado})</th>
              <th>Operario Asignado</th>
            </tr>
          </thead>
          <tbody>
            {listaFiltrada.length === 0 ? (
              <tr><td colSpan="5" className="empty-table-cell">No hay equipos en la base de datos.</td></tr>
            ) : (
              listaFiltrada.map((item, idx) => {
                const infoMes = getEstadoMensual(item.eq);
                return (
                  <tr key={idx}>
                    <td><strong>{item.eq}</strong></td>
                    <td><span className="sub-sector">{item.cl}</span></td>
                    <td>
                      {item.excel ? (
                        <button 
                          type="button"
                          onClick={() => window.open(item.excel, '_blank')}
                          style={{background: 'none', border: 'none', color: '#10B981', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', padding: 0}}
                        >
                          📄 Ver Excel
                        </button>
                      ) : (
                        <span style={{color: '#9CA3AF', fontSize: '0.85rem'}}>-</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge-tabla-${infoMes.estado.toLowerCase().replace(' ', '-')}`}>
                        {infoMes.estado}
                      </span>
                      <div style={{fontSize: '0.75rem', color: '#6B7280', marginTop: '4px'}}>{infoMes.fecha}</div>
                    </td>
                    <td>
                      {infoMes.operario !== '-' ? <span className="badge-operario">{infoMes.operario}</span> : <span style={{color: '#9CA3AF'}}>-</span>}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}