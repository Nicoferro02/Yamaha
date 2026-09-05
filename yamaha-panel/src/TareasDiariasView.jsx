import React, {
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  guardarTareasDiarias,
  leerTareasDiarias,
  TAREAS_DIARIAS_EVENT
} from './tareasDiariasStore';

export default function TareasDiariasView({
  fechaPantalla,
  setFechaPantalla,
  pantallaStr,
  operarios
}) {
  const [tareas, setTareas] = useState(
    () => leerTareasDiarias()
  );

  const [filtroOperario, setFiltroOperario] =
    useState('Todos');

  useEffect(() => {
    const refrescar = () => {
      setTareas(
        leerTareasDiarias()
      );
    };

    window.addEventListener(
      TAREAS_DIARIAS_EVENT,
      refrescar
    );

    window.addEventListener(
      'storage',
      refrescar
    );

    return () => {
      window.removeEventListener(
        TAREAS_DIARIAS_EVENT,
        refrescar
      );

      window.removeEventListener(
        'storage',
        refrescar
      );
    };
  }, []);

  const formatearFecha = (fecha) => {
    const dia = String(
      fecha.getDate()
    ).padStart(2, '0');

    const mes = String(
      fecha.getMonth() + 1
    ).padStart(2, '0');

    return `${dia}/${mes}/${fecha.getFullYear()}`;
  };

  const tareasFecha = useMemo(
    () =>
      tareas
        .filter(
          (tarea) =>
            tarea.fecha === pantallaStr
        )
        .sort((a, b) => {
          if (
            a.estado !== b.estado
          ) {
            return a.estado === 'Pendiente'
              ? -1
              : 1;
          }

          return a.operario.localeCompare(
            b.operario
          );
        }),
    [tareas, pantallaStr]
  );

  const tareasVisibles = useMemo(
    () =>
      filtroOperario === 'Todos'
        ? tareasFecha
        : tareasFecha.filter(
            (tarea) =>
              tarea.operario ===
              filtroOperario
          ),
    [
      tareasFecha,
      filtroOperario
    ]
  );

  const completadas =
    tareasFecha.filter(
      (tarea) =>
        tarea.estado === 'Completado'
    ).length;

  const pendientes =
    tareasFecha.length -
    completadas;

  const porcentaje =
    tareasFecha.length > 0
      ? Math.round(
          (
            completadas /
            tareasFecha.length
          ) * 100
        )
      : 0;

  const cambiarEstado = (
    id,
    nuevoEstado
  ) => {
    const actualizadas =
      tareas.map((tarea) => {
        if (tarea.id !== id) {
          return tarea;
        }

        return {
          ...tarea,
          estado: nuevoEstado,
          completadoPor:
            nuevoEstado ===
            'Completado'
              ? tarea.operario
              : null,
          fechaCompletado:
            nuevoEstado ===
            'Completado'
              ? tarea.fecha
              : null
        };
      });

    setTareas(actualizadas);
    guardarTareasDiarias(
      actualizadas
    );
  };

  return (
    <main className="yamaha-main">

      <section className="td-hero">

        <div>
          <span className="section-eyebrow">
            ORGANIZACIÓN DEL DÍA
          </span>

          <h2>
            Tareas diarias
          </h2>

          <p>
            Trabajos asignados por
            supervisión para cada
            operario.
          </p>
        </div>

        <div className="td-fecha-card">
          <span>
            Fecha seleccionada
          </span>

          <strong>
            {formatearFecha(
              fechaPantalla
            )}
          </strong>
        </div>

      </section>

      <section className="td-kpis">

        <div className="td-kpi">
          <span>
            Total
          </span>

          <strong>
            {tareasFecha.length}
          </strong>
        </div>

        <div className="td-kpi td-kpi-success">
          <span>
            Completadas
          </span>

          <strong>
            {completadas}
          </strong>
        </div>

        <div className="td-kpi td-kpi-warning">
          <span>
            Pendientes
          </span>

          <strong>
            {pendientes}
          </strong>
        </div>

        <div className="td-kpi td-kpi-progress">

          <div className="td-kpi-progress-top">
            <span>
              Avance del día
            </span>

            <strong>
              {porcentaje}%
            </strong>
          </div>

          <div className="td-progress">
            <div
              style={{
                width:
                  `${porcentaje}%`
              }}
            />
          </div>

        </div>

      </section>

      <section className="td-toolbar">

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
              className="input-fecha-display"
              type="text"
              value={formatearFecha(
                fechaPantalla
              )}
              readOnly
            />

            <input
              className="input-fecha-hidden"
              type="date"
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

        <div className="td-filtro">

          <label>
            Ver tareas de
          </label>

          <select
            value={
              filtroOperario
            }
            onChange={(e) =>
              setFiltroOperario(
                e.target.value
              )
            }
          >
            <option value="Todos">
              Todos los operarios
            </option>

            {operarios.map(
              (operario) => (
                <option
                  key={operario}
                  value={operario}
                >
                  {operario}
                </option>
              )
            )}
          </select>

        </div>

      </section>

      <section className="td-panel">

        <div className="td-panel-header">

          <div>
            <span className="section-eyebrow">
              TAREAS ASIGNADAS
            </span>

            <h3>
              Trabajo del día
            </h3>
          </div>

          <span className="counter-badge">
            {tareasVisibles.length}{' '}
            tareas
          </span>

        </div>

        {tareasVisibles.length ===
        0 ? (

          <div className="td-empty">

            <div className="td-empty-icon">
              ✓
            </div>

            <h3>
              Sin tareas asignadas
            </h3>

            <p>
              No hay tareas diarias
              cargadas para esta fecha
              y filtro.
            </p>

          </div>

        ) : (

          <div className="td-table-wrap">

            <table className="td-table">

              <thead>
                <tr>
                  <th>Estado</th>
                  <th>Responsable</th>
                  <th>Tarea</th>
                  <th>Detalle</th>
                  <th>Acción</th>
                </tr>
              </thead>

              <tbody>

                {tareasVisibles.map(
                  (tarea) => {

                    const completada =
                      tarea.estado ===
                      'Completado';

                    return (
                      <tr
                        key={
                          tarea.id
                        }
                        className={
                          completada
                            ? 'td-row-completed'
                            : ''
                        }
                      >

                        <td
                          data-label="Estado"
                        >
                          <span
                            className={`td-status ${
                              completada
                                ? 'completed'
                                : 'pending'
                            }`}
                          >
                            {completada
                              ? '✓ Completada'
                              : 'Pendiente'}
                          </span>
                        </td>

                        <td
                          data-label="Responsable"
                        >
                          <strong className="td-operario">
                            {
                              tarea.operario
                            }
                          </strong>
                        </td>

                        <td
                          data-label="Tarea"
                        >
                          <strong className="td-task-title">
                            {
                              tarea.titulo
                            }
                          </strong>
                        </td>

                        <td
                          data-label="Detalle"
                        >
                          <span className="td-task-detail">
                            {tarea.descripcion ||
                              '—'}
                          </span>
                        </td>

                        <td
                          data-label="Acción"
                        >
                          <button
                            type="button"
                            className={`td-action-button ${
                              completada
                                ? 'reopen'
                                : 'complete'
                            }`}
                            onClick={() =>
                              cambiarEstado(
                                tarea.id,
                                completada
                                  ? 'Pendiente'
                                  : 'Completado'
                              )
                            }
                          >
                            {completada
                              ? '↺ Reabrir'
                              : '✓ Completar'}
                          </button>
                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </main>
  );
}
