import React, {
  useMemo,
  useState
} from 'react';

export default function AuditoriaView({
  bancoPreventivos,
  agendaPorFecha,
  fechaPantalla,
  setFechaPantalla,
  getOperarioForDate
}) {
  const [
    filtroTexto,
    setFiltroTexto
  ] = useState('');

  const mesSeleccionado =
    `${fechaPantalla.getFullYear()}-${String(
      fechaPantalla.getMonth() +
        1
    ).padStart(2, '0')}`;

  /*
    Determina el estado del
    preventivo durante el mes.
  */

  const getEstadoMensual = (
    nombreEquipo
  ) => {
    let ultimoEstado =
      'No Programado';

    let fechaCompletado = '-';
    let operarioAsignado = '-';

    const fechasDelMes =
      Object.keys(
        agendaPorFecha
      )
        .filter((key) =>
          key.startsWith(
            mesSeleccionado
          )
        )
        .sort();

    fechasDelMes.forEach(
      (fechaKey) => {
        const tareas =
          agendaPorFecha[
            fechaKey
          ] || [];

        const tareaEncontrada =
          tareas.find(
            (tarea) =>
              tarea.eq ===
              nombreEquipo
          );

        if (tareaEncontrada) {
          ultimoEstado =
            tareaEncontrada.estado;

          fechaCompletado =
            fechaKey;

          if (
            typeof getOperarioForDate ===
            'function'
          ) {
            operarioAsignado =
              getOperarioForDate(
                fechaKey
              );
          }
        }
      }
    );

    return {
      estado: ultimoEstado,
      fecha: fechaCompletado,
      operario:
        operarioAsignado
    };
  };

  const listaFiltrada =
    useMemo(() => {
      if (!filtroTexto) {
        return bancoPreventivos;
      }

      const busqueda =
        filtroTexto
          .toLowerCase()
          .trim();

      return bancoPreventivos.filter(
        (item) =>
          item.eq
            ?.toLowerCase()
            .includes(busqueda) ||
          item.cl
            ?.toLowerCase()
            .includes(busqueda)
      );
    }, [
      bancoPreventivos,
      filtroTexto
    ]);

  /*
    Abre una nueva pestaña
    de la aplicación y envía
    el ID de la hoja Excel.
  */

  const abrirPreventivo = (
    item
  ) => {
    if (!item.idExcel) {
      alert(
        'Este preventivo todavía no tiene una hoja de Excel asignada.'
      );

      return;
    }

    const url = new URL(
      window.location.origin +
        window.location.pathname
    );

    url.searchParams.set(
      'preventivoExcel',
      String(item.idExcel)
    );

    url.searchParams.set(
      'equipo',
      item.eq
    );

    window.open(
      url.toString(),
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="auditoria-view-container">
      <div
        className="supervisor-header-panel"
        style={{
          marginBottom:
            '20px',

          display: 'flex',

          justifyContent:
            'space-between',

          alignItems:
            'flex-start',

          flexWrap: 'wrap',

          gap: '15px'
        }}
      >
        <div>
          <h2
            style={{
              margin:
                '0 0 5px 0'
            }}
          >
            Catálogo de
            Preventivos
          </h2>

          <p
            style={{
              margin: 0,
              color:
                '#6B7280'
            }}
          >
            El estado de la
            lista se reinicia
            automáticamente
            cada mes.
          </p>
        </div>

        <div
          style={{
            background:
              'white',

            padding:
              '10px 15px',

            borderRadius:
              '8px',

            border:
              '1px solid var(--y-border)',

            display: 'flex',

            alignItems:
              'center',

            gap: '10px'
          }}
        >
          <span
            style={{
              fontSize:
                '0.85rem',

              fontWeight:
                'bold'
            }}
          >
            Viendo el mes de:
          </span>

          <button
            className="btn-icon-sq"
            style={{
              width: '28px',
              height:
                '28px'
            }}
            onClick={() =>
              setFechaPantalla(
                new Date(
                  fechaPantalla.getFullYear(),
                  fechaPantalla.getMonth() -
                    1,
                  1
                )
              )
            }
          >
            ◀
          </button>

          <strong
            style={{
              color:
                'var(--y-red)'
            }}
          >
            {mesSeleccionado}
          </strong>

          <button
            className="btn-icon-sq"
            style={{
              width: '28px',
              height:
                '28px'
            }}
            onClick={() =>
              setFechaPantalla(
                new Date(
                  fechaPantalla.getFullYear(),
                  fechaPantalla.getMonth() +
                    1,
                  1
                )
              )
            }
          >
            ▶
          </button>
        </div>
      </div>

      <div
        className="filtro-maquina-container"
        style={{
          marginBottom:
            '20px'
        }}
      >
        <input
          type="text"
          placeholder="🔍 Buscar máquina en la base de datos..."
          value={
            filtroTexto
          }
          onChange={(e) =>
            setFiltroTexto(
              e.target.value
            )
          }
          className="input-filtro-supervisor"
          style={{
            padding:
              '12px',

            width:
              '350px',

            maxWidth:
              '100%',

            borderRadius:
              '4px',

            border:
              '1px solid var(--y-border)'
          }}
        />
      </div>

      <div className="tabla-auditoria-container">
        <table className="tabla-auditoria">
          <thead>
            <tr>
              <th>
                Nombre del
                Equipo /
                Máquina
              </th>

              <th>
                Sector
              </th>

              <th>
                Documento
              </th>

              <th>
                Estado (
                {
                  mesSeleccionado
                }
                )
              </th>

              <th>
                Operario
                Asignado
              </th>
            </tr>
          </thead>

          <tbody>
            {listaFiltrada.length ===
            0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="empty-table-cell"
                >
                  No hay
                  equipos en la
                  base de
                  datos.
                </td>
              </tr>
            ) : (
              listaFiltrada.map(
                (
                  item,
                  idx
                ) => {
                  const infoMes =
                    getEstadoMensual(
                      item.eq
                    );

                  const claseEstado =
                    String(
                      infoMes.estado
                    )
                      .toLowerCase()
                      .replace(
                        /\s+/g,
                        '-'
                      );

                  return (
                    <tr
                      key={
                        item.idExcel ||
                        idx
                      }
                    >
                      <td>
                        <strong>
                          {
                            item.eq
                          }
                        </strong>
                      </td>

                      <td>
                        <span className="sub-sector">
                          {
                            item.cl
                          }
                        </span>
                      </td>

                      <td>
                        {item.idExcel ? (
                          <button
                            type="button"
                            onClick={() =>
                              abrirPreventivo(
                                item
                              )
                            }
                            style={{
                              background:
                                'none',

                              border:
                                'none',

                              color:
                                '#10B981',

                              textDecoration:
                                'none',

                              fontWeight:
                                'bold',

                              fontSize:
                                '0.85rem',

                              cursor:
                                'pointer',

                              padding:
                                0
                            }}
                          >
                            📄 Ver
                            Preventivo
                          </button>
                        ) : (
                          <span
                            style={{
                              color:
                                '#9CA3AF',

                              fontSize:
                                '0.85rem'
                            }}
                          >
                            -
                          </span>
                        )}
                      </td>

                      <td>
                        <span
                          className={`badge-tabla-${claseEstado}`}
                        >
                          {
                            infoMes.estado
                          }
                        </span>

                        <div
                          style={{
                            fontSize:
                              '0.75rem',

                            color:
                              '#6B7280',

                            marginTop:
                              '4px'
                          }}
                        >
                          {
                            infoMes.fecha
                          }
                        </div>
                      </td>

                      <td>
                        {infoMes.operario !==
                        '-' ? (
                          <span className="badge-operario">
                            {
                              infoMes.operario
                            }
                          </span>
                        ) : (
                          <span
                            style={{
                              color:
                                '#9CA3AF'
                            }}
                          >
                            -
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                }
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}