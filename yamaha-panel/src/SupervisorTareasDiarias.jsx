import React, {
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  crearIdTareaDiaria,
  guardarTareasDiarias,
  leerTareasDiarias,
  TAREAS_DIARIAS_EVENT
} from './tareasDiariasStore';

export default function SupervisorTareasDiarias({
  fechaPantalla,
  setFechaPantalla,
  pantallaStr,
  operarios
}) {
  const [tareas, setTareas] = useState(
    () => leerTareasDiarias()
  );

  const [titulo, setTitulo] =
    useState('');

  const [descripcion, setDescripcion] =
    useState('');

  const [operario, setOperario] =
    useState(
      operarios[0] || ''
    );

  useEffect(() => {
    if (
      operarios.length > 0 &&
      !operarios.includes(
        operario
      )
    ) {
      setOperario(
        operarios[0]
      );
    }
  }, [operarios, operario]);

  useEffect(() => {
    const refrescar = () =>
      setTareas(
        leerTareasDiarias()
      );

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

  const completadas =
    tareasFecha.filter(
      (tarea) =>
        tarea.estado === 'Completado'
    ).length;

  const pendientes =
    tareasFecha.length -
    completadas;

  const crearTarea = (e) => {
    e.preventDefault();

    if (!titulo.trim()) {
      alert(
        'Escribí la tarea a realizar.'
      );

      return;
    }

    if (!operario) {
      alert(
        'Seleccioná un operario.'
      );

      return;
    }

    const nueva = {
      id:
        crearIdTareaDiaria(),

      fecha:
        pantallaStr,

      titulo:
        titulo.trim(),

      descripcion:
        descripcion.trim(),

      operario,

      estado:
        'Pendiente',

      completadoPor:
        null,

      fechaCompletado:
        null
    };

    const actualizadas = [
      ...tareas,
      nueva
    ];

    setTareas(actualizadas);

    guardarTareasDiarias(
      actualizadas
    );

    setTitulo('');
    setDescripcion('');
  };

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

          estado:
            nuevoEstado,

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

  const eliminarTarea = (
    tarea
  ) => {
    const confirmar =
      window.confirm(
        `¿Eliminar la tarea "${tarea.titulo}" asignada a ${tarea.operario}?`
      );

    if (!confirmar) {
      return;
    }

    const actualizadas =
      tareas.filter(
        (item) =>
          item.id !== tarea.id
      );

    setTareas(actualizadas);

    guardarTareasDiarias(
      actualizadas
    );
  };

  return (
    <div className="td-supervisor">

      <section className="td-admin-heading">

        <div>
          <span className="section-eyebrow">
            TAREAS OPERATIVAS
          </span>

          <h2>
            Tareas diarias
          </h2>

          <p>
            Asigná trabajos
            independientes de los
            preventivos a cada operario.
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

      <section className="td-admin-kpis">

        <div className="td-admin-kpi">
          <span>
            Tareas del día
          </span>

          <strong>
            {tareasFecha.length}
          </strong>
        </div>

        <div className="td-admin-kpi success">
          <span>
            Completadas
          </span>

          <strong>
            {completadas}
          </strong>
        </div>

        <div className="td-admin-kpi warning">
          <span>
            Pendientes
          </span>

          <strong>
            {pendientes}
          </strong>
        </div>

      </section>

      <section className="td-admin-control">

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

      </section>

      <section className="td-create-card">

        <div className="td-create-header">

          <div>
            <span className="section-eyebrow">
              NUEVA ASIGNACIÓN
            </span>

            <h3>
              Asignar tarea
            </h3>
          </div>

        </div>

        <form
          className="td-create-form"
          onSubmit={crearTarea}
        >

          <div className="td-field">

            <label>
              Operario responsable
            </label>

            <select
              value={operario}
              onChange={(e) =>
                setOperario(
                  e.target.value
                )
              }
            >
              {operarios.length ===
              0 ? (
                <option value="">
                  No hay operarios
                </option>
              ) : (
                operarios.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )
              )}
            </select>

          </div>

          <div className="td-field td-field-grow">

            <label>
              Tarea
            </label>

            <input
              type="text"
              value={titulo}
              onChange={(e) =>
                setTitulo(
                  e.target.value
                )
              }
              maxLength={100}
              placeholder="Ej.: Revisar pérdida de aire en línea B"
            />

          </div>

          <div className="td-field td-field-description">

            <label>
              Detalle / indicación
              <span>
                {' '}opcional
              </span>
            </label>

            <textarea
              value={descripcion}
              onChange={(e) =>
                setDescripcion(
                  e.target.value
                )
              }
              maxLength={300}
              rows="3"
              placeholder="Agregá una aclaración si hace falta..."
            />

          </div>

          <button
            type="submit"
            className="td-create-button"
          >
            + Asignar tarea
          </button>

        </form>

      </section>

      <section className="td-panel">

        <div className="td-panel-header">

          <div>
            <span className="section-eyebrow">
              PLAN DEL DÍA
            </span>

            <h3>
              Tareas asignadas
            </h3>
          </div>

          <span className="counter-badge">
            {tareasFecha.length}{' '}
            tareas
          </span>

        </div>

        {tareasFecha.length ===
        0 ? (

          <div className="td-empty">

            <div className="td-empty-icon">
              +
            </div>

            <h3>
              Todavía no hay tareas
            </h3>

            <p>
              Usá el formulario de
              arriba para asignar la
              primera tarea del día.
            </p>

          </div>

        ) : (

          <div className="td-table-wrap">

            <table className="td-table td-admin-table">

              <thead>
                <tr>
                  <th>Estado</th>
                  <th>Operario</th>
                  <th>Tarea</th>
                  <th>Detalle</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>

                {tareasFecha.map(
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
                          data-label="Operario"
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
                          data-label="Acciones"
                        >
                          <div className="td-admin-actions">

                            <button
                              type="button"
                              className="td-small-action"
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
                                ? 'Reabrir'
                                : 'Completar'}
                            </button>

                            <button
                              type="button"
                              className="td-small-action danger"
                              onClick={() =>
                                eliminarTarea(
                                  tarea
                                )
                              }
                            >
                              Eliminar
                            </button>

                          </div>
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

    </div>
  );
}
