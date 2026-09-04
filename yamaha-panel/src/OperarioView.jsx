import React, { useMemo, useState } from 'react';

export default function OperarioView({
  fechaPantalla,
  setFechaPantalla,
  pantallaStr,
  operarioDelDia,
  agendaPorFecha,
  setAgendaPorFecha,
  notasTareas,
  setNotasTareas
}) {
  const [notaActivaId, setNotaActivaId] = useState(null);
  const [tempNota, setTempNota] = useState('');

  const esFinDeSemana =
    fechaPantalla.getDay() === 0 ||
    fechaPantalla.getDay() === 6;

  const tareasDelDia = useMemo(() => {
    if (esFinDeSemana) return [];

    return agendaPorFecha[pantallaStr] || [];
  }, [
    agendaPorFecha,
    pantallaStr,
    esFinDeSemana
  ]);

  const totalTareas = tareasDelDia.length;

  const completadas = tareasDelDia.filter(
    (t) => t.estado === 'Completado'
  ).length;

  const pendientes = Math.max(
    totalTareas - completadas,
    0
  );

  const porcentaje =
    totalTareas > 0
      ? Math.round(
          (completadas / totalTareas) * 100
        )
      : 0;

  const formatearFechaDisplay = (fecha) => {
    const dia = String(
      fecha.getDate()
    ).padStart(2, '0');

    const mes = String(
      fecha.getMonth() + 1
    ).padStart(2, '0');

    return `${dia}/${mes}/${fecha.getFullYear()}`;
  };

  const obtenerIdNota = (
    tarea,
    index
  ) => {
    if (tarea.id) {
      return `${pantallaStr}-id-${tarea.id}`;
    }

    return `${pantallaStr}-t-${index}-${tarea.eq}`;
  };

  const obtenerNota = (
    tarea,
    index
  ) => {
    const idNuevo =
      obtenerIdNota(
        tarea,
        index
      );

    if (
      notasTareas[idNuevo] !==
      undefined
    ) {
      return notasTareas[idNuevo];
    }

    const idAnterior =
      `${pantallaStr}-t-${index}-${tarea.eq}`;

    return (
      notasTareas[idAnterior] ||
      ''
    );
  };

  const marcarEstadoTarea = (
    index,
    nuevoEstado
  ) => {
    setAgendaPorFecha(
      (prev) => {
        const listaActual =
          prev[pantallaStr] || [];

        const nuevaLista =
          listaActual.map(
            (tarea, i) => {
              if (i !== index) {
                return tarea;
              }

              return {
                ...tarea,

                estado:
                  nuevoEstado,

                completadoPor:
                  nuevoEstado ===
                  'Completado'
                    ? operarioDelDia
                    : null,

                fechaCompletado:
                  nuevoEstado ===
                  'Completado'
                    ? pantallaStr
                    : null
              };
            }
          );

        return {
          ...prev,
          [pantallaStr]:
            nuevaLista
        };
      }
    );
  };

  const abrirEditorNota = (
    tarea,
    index
  ) => {
    const id =
      obtenerIdNota(
        tarea,
        index
      );

    setNotaActivaId(id);

    setTempNota(
      obtenerNota(
        tarea,
        index
      )
    );
  };

  const guardarNota = (
    idTarea
  ) => {
    setNotasTareas(
      (prev) => ({
        ...prev,

        [idTarea]:
          tempNota.trim()
      })
    );

    setNotaActivaId(null);
    setTempNota('');
  };

  return (
    <main className="yamaha-main">

      <section className="operario-hero">

        <div className="operario-hero-info">

          <span className="section-eyebrow">
            MANTENIMIENTO PREVENTIVO
          </span>

          <h2>
            Preventivos del día
          </h2>

          <p>
            Responsable asignado:{' '}
            <strong>
              {operarioDelDia}
            </strong>
          </p>

        </div>

        <div className="operario-date-card">

          <span>
            Fecha seleccionada
          </span>

          <strong>
            {formatearFechaDisplay(
              fechaPantalla
            )}
          </strong>

        </div>

      </section>

      <section className="operario-resumen">

        <div className="resumen-stat">

          <span className="resumen-stat-label">
            Preventivos
          </span>

          <strong>
            {totalTareas}
          </strong>

        </div>

        <div className="resumen-stat success">

          <span className="resumen-stat-label">
            Completados
          </span>

          <strong>
            {completadas}
          </strong>

        </div>

        <div className="resumen-stat warning">

          <span className="resumen-stat-label">
            Pendientes
          </span>

          <strong>
            {pendientes}
          </strong>

        </div>

        <div className="resumen-progress">

          <div className="resumen-progress-top">

            <span>
              Avance del día
            </span>

            <strong>
              {porcentaje}%
            </strong>

          </div>

          <div className="progress-bar-large">

            <div
              style={{
                width:
                  `${porcentaje}%`
              }}
            />

          </div>

        </div>

      </section>

      <section className="panel-control-dia operario-fecha-control">

        <div className="nav-fechas">

          <button
            type="button"
            className="btn-icon-sq"
            onClick={() =>
              setFechaPantalla(
                new Date(
                  fechaPantalla.getFullYear(),
                  fechaPantalla.getMonth(),
                  fechaPantalla.getDate() -
                    1
                )
              )
            }
          >
            ◀
          </button>

          <div className="input-fecha-wrapper">

            <input
              type="text"
              className="input-fecha-display"
              value={formatearFechaDisplay(
                fechaPantalla
              )}
              readOnly
            />

            <input
              type="date"
              className="input-fecha-hidden"
              value={pantallaStr}
              onChange={(e) => {
                if (
                  e.target.value
                ) {
                  setFechaPantalla(
                    new Date(
                      e.target.value +
                        'T00:00:00'
                    )
                  );
                }
              }}
            />

          </div>

          <button
            type="button"
            className="btn-icon-sq"
            onClick={() =>
              setFechaPantalla(
                new Date(
                  fechaPantalla.getFullYear(),
                  fechaPantalla.getMonth(),
                  fechaPantalla.getDate() +
                    1
                )
              )
            }
          >
            ▶
          </button>

        </div>

      </section>

      {esFinDeSemana ? (

        <div className="empty-state">

          <div className="empty-state-icon">
            🌙
          </div>

          <h3>
            Día no laborable
          </h3>

          <p>
            No hay preventivos programados
            para esta fecha.
          </p>

        </div>

      ) : tareasDelDia.length ===
        0 ? (

        <div className="empty-state">

          <div className="empty-state-icon">
            ✓
          </div>

          <h3>
            Sin preventivos asignados
          </h3>

          <p>
            No hay tareas programadas para
            este día.
          </p>

        </div>

      ) : (

        <div className="grid-preventivos">

          {tareasDelDia.map(
            (tarea, index) => {

              const esCompletado =
                tarea.estado ===
                'Completado';

              const tareaId =
                obtenerIdNota(
                  tarea,
                  index
                );

              const notaActual =
                obtenerNota(
                  tarea,
                  index
                );

              return (

                <article
                  key={
                    tarea.id ||
                    `${tarea.eq}-${index}`
                  }
                  className={`card-tarea ${
                    esCompletado
                      ? 'completado'
                      : 'pendiente'
                  }`}
                >

                  <div className="card-imagen-container">

                    <img
                      src={tarea.img}
                      alt={tarea.eq}
                      className="card-imagen"
                      onError={(e) => {
                        e.currentTarget.style.display =
                          'none';
                      }}
                    />

                    <div className="card-image-overlay" />

                    <span className="tarea-numero">
                      PREV. {index + 1}
                    </span>

                    <span
                      className={`status-pill ${
                        esCompletado
                          ? 'success'
                          : 'warning'
                      }`}
                    >
                      {esCompletado
                        ? '✓ Completado'
                        : 'Pendiente'}
                    </span>

                  </div>

                  <div className="card-body">

                    <div className="card-title-group">

                      <h3 className="equipo-titulo">
                        {tarea.eq}
                      </h3>

                      <p className="cliente-subtitulo">
                        {tarea.cl}
                      </p>

                    </div>

                    {esCompletado &&
                      tarea.completadoPor && (

                        <div className="completion-info">

                          <span className="completion-icon">
                            ✓
                          </span>

                          <div>

                            <span>
                              Preventivo registrado
                            </span>

                            <strong>
                              {
                                tarea.completadoPor
                              }
                            </strong>

                          </div>

                        </div>

                      )}

                    <div className="seccion-procedimiento">

                      {tarea.excel ? (

                        <a
                          href={
                            tarea.excel
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="btn-ver-excel"
                        >
                          📄 Ver procedimiento
                        </a>

                      ) : (

                        <div className="procedure-unavailable">
                          ⚠ Sin procedimiento
                          asociado
                        </div>

                      )}

                    </div>

                    <div className="seccion-notas">

                      <div className="section-label-small">
                        OBSERVACIONES / FALLAS
                      </div>

                      {notaActivaId ===
                      tareaId ? (

                        <div className="box-editar-nota">

                          <textarea
                            rows="3"
                            placeholder="Describí una observación, anomalía o falla encontrada..."
                            value={tempNota}
                            onChange={(e) =>
                              setTempNota(
                                e.target
                                  .value
                              )
                            }
                            autoFocus
                          />

                          <div className="acciones-nota">

                            <button
                              type="button"
                              className="btn-save-nota"
                              onClick={() =>
                                guardarNota(
                                  tareaId
                                )
                              }
                            >
                              Guardar
                            </button>

                            <button
                              type="button"
                              className="btn-cancel-nota"
                              onClick={() => {
                                setNotaActivaId(
                                  null
                                );

                                setTempNota(
                                  ''
                                );
                              }}
                            >
                              Cancelar
                            </button>

                          </div>

                        </div>

                      ) : (

                        <button
                          type="button"
                          className={`box-ver-nota ${
                            notaActual
                              ? 'has-note'
                              : ''
                          }`}
                          onClick={() =>
                            abrirEditorNota(
                              tarea,
                              index
                            )
                          }
                        >

                          {notaActual ? (

                            <>
                              <span className="nota-icon">
                                ⚠
                              </span>

                              <span className="nota-texto">
                                {
                                  notaActual
                                }
                              </span>
                            </>

                          ) : (

                            <span className="agregar-nota-link">
                              + Agregar observación
                              o reportar falla
                            </span>

                          )}

                        </button>

                      )}

                    </div>

                  </div>

                  <div className="card-footer">

                    <button
                      type="button"
                      className={`btn-completar ${
                        esCompletado
                          ? 'completed'
                          : ''
                      }`}
                      onClick={() =>
                        marcarEstadoTarea(
                          index,
                          esCompletado
                            ? 'Pendiente'
                            : 'Completado'
                        )
                      }
                    >

                      {esCompletado
                        ? '↺ Reabrir preventivo'
                        : '✓ Marcar como completado'}

                    </button>

                  </div>

                </article>

              );
            }
          )}

        </div>

      )}

    </main>
  );
}