import React, {
  useMemo,
  useState
} from 'react';

import AuditoriaView from './AuditoriaView';
import SupervisorTareasDiarias from './SupervisorTareasDiarias';


export default function SupervisorView({
  fechaPantalla,
  setFechaPantalla,
  pantallaStr,

  operarioSemanaAnterior,
  operarioSemanaActual,
  operarioProximaSemana,
  operarioDelDia,

  cambiarOperarioSemana,
  cambiarOperarioDiario,

  agendaPorFecha,
  setAgendaPorFecha,

  notasTareas,

  operarios,
  setOperarios,

  bancoPreventivos,
  setBancoPreventivos,

  asignacionesDiarias,
  asignacionesSemanales
}) {
  const [
    subVista,
    setSubVista
  ] = useState('gestion');

  const [
    editandoTareaIndex,
    setEditandoTareaIndex
  ] = useState(null);

  const [
    seleccionIndexBanco,
    setSeleccionIndexBanco
  ] = useState('');

  const [
    modalAgregarAbierto,
    setModalAgregarAbierto
  ] = useState(false);

  const [
    itemNuevoIndex,
    setItemNuevoIndex
  ] = useState('');

  const [
    nuevoEquipo,
    setNuevoEquipo
  ] = useState('');

  const [
    nuevoSector,
    setNuevoSector
  ] = useState('');

  const [
    nuevoImg,
    setNuevoImg
  ] = useState('');

  const [
    nuevoExcel,
    setNuevoExcel
  ] = useState(
    '/planillas.xlsx'
  );

  const [
    modalOperarios,
    setModalOperarios
  ] = useState(false);

  const [
    nuevoOperarioNom,
    setNuevoOperarioNom
  ] = useState('');


  const esFinDeSemana =
    fechaPantalla.getDay() ===
      0 ||
    fechaPantalla.getDay() ===
      6;


  const tareasDelDia =
    useMemo(() => {
      if (esFinDeSemana) {
        return [];
      }

      return (
        agendaPorFecha[
          pantallaStr
        ] || []
      );
    }, [
      agendaPorFecha,
      pantallaStr,
      esFinDeSemana
    ]);


  const completadasHoy =
    tareasDelDia.filter(
      (tarea) =>
        tarea.estado ===
        'Completado'
    ).length;


  const pendientesHoy =
    Math.max(
      tareasDelDia.length -
        completadasHoy,
      0
    );


  const porcentajeHoy =
    tareasDelDia.length > 0
      ? Math.round(
          (
            completadasHoy /
            tareasDelDia.length
          ) * 100
        )
      : 0;


  const actualizarAgendaDia = (
    nuevaLista
  ) => {
    setAgendaPorFecha(
      (prev) => ({
        ...prev,

        [pantallaStr]:
          nuevaLista
      })
    );
  };


  const guardarIntercambio = (
    index
  ) => {
    if (
      seleccionIndexBanco ===
      ''
    ) {
      return;
    }

    const item =
      bancoPreventivos[
        Number(
          seleccionIndexBanco
        )
      ];

    if (!item) {
      return;
    }

    const nuevaLista = [
      ...tareasDelDia
    ];

    nuevaLista[index] = {
      ...nuevaLista[index],

      eq:
        item.eq,

      cl:
        item.cl,

      img:
        item.img,

      excel:
        item.excel ||
        '/planillas.xlsx'
    };

    actualizarAgendaDia(
      nuevaLista
    );

    setEditandoTareaIndex(
      null
    );

    setSeleccionIndexBanco(
      ''
    );
  };


  const agregarPreventivo =
    () => {
      if (
        itemNuevoIndex === ''
      ) {
        return;
      }

      const item =
        bancoPreventivos[
          Number(
            itemNuevoIndex
          )
        ];

      if (!item) {
        return;
      }

      const id =
        typeof crypto !==
          'undefined' &&
        typeof crypto.randomUUID ===
          'function'
          ? crypto.randomUUID()
          : `t_${Date.now()}_${Math.random()
              .toString(36)
              .slice(2, 7)}`;

      const nuevaLista = [
        ...tareasDelDia,

        {
          id,

          eq:
            item.eq,

          cl:
            item.cl,

          img:
            item.img,

          excel:
            item.excel ||
            '/planillas.xlsx',

          estado:
            'Pendiente',

          completadoPor:
            null,

          fechaCompletado:
            null
        }
      ];

      actualizarAgendaDia(
        nuevaLista
      );

      setItemNuevoIndex(
        ''
      );

      setModalAgregarAbierto(
        false
      );
    };


  const eliminarPreventivo = (
    index
  ) => {
    const tarea =
      tareasDelDia[index];

    if (!tarea) {
      return;
    }

    const confirmar =
      window.confirm(
        `¿Eliminar "${tarea.eq}" de la planificación de este día?`
      );

    if (!confirmar) {
      return;
    }

    actualizarAgendaDia(
      tareasDelDia.filter(
        (_, i) =>
          i !== index
      )
    );
  };


  const handleImageUpload = (
    e
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    const limite =
      2 *
      1024 *
      1024;

    if (
      file.size >
      limite
    ) {
      alert(
        'La imagen es demasiado pesada. Usá una imagen menor a 2 MB.'
      );

      e.target.value = '';

      return;
    }

    const reader =
      new FileReader();

    reader.onloadend =
      () =>
        setNuevoImg(
          reader.result
        );

    reader.readAsDataURL(
      file
    );
  };


  const guardarNuevoPreventivo =
    (e) => {
      e.preventDefault();

      if (
        !nuevoEquipo.trim() ||
        !nuevoSector.trim()
      ) {
        alert(
          'Completá el nombre del equipo y el sector.'
        );

        return;
      }

      const imagenFinal =
        nuevoImg ||
        'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=70';

      const id =
        typeof crypto !==
          'undefined' &&
        typeof crypto.randomUUID ===
          'function'
          ? crypto.randomUUID()
          : `eq_${Date.now()}_${Math.random()
              .toString(36)
              .slice(2, 7)}`;

      const preventivoNuevo =
        {
          id,

          eq:
            nuevoEquipo.trim(),

          cl:
            nuevoSector.trim(),

          img:
            imagenFinal,

          excel:
            nuevoExcel.trim() ||
            '/planillas.xlsx'
        };

      setBancoPreventivos(
        (prev) => [
          ...prev,
          preventivoNuevo
        ]
      );

      setNuevoEquipo('');
      setNuevoSector('');
      setNuevoImg('');

      setNuevoExcel(
        '/planillas.xlsx'
      );
    };


  const borrarDelBancoMaestro =
    (index) => {
      const equipo =
        bancoPreventivos[
          index
        ];

      if (!equipo) {
        return;
      }

      const confirmar =
        window.confirm(
          `¿Eliminar "${equipo.eq}" del Maestro de Equipos?`
        );

      if (!confirmar) {
        return;
      }

      setBancoPreventivos(
        (prev) =>
          prev.filter(
            (_, i) =>
              i !== index
          )
      );
    };


  const agregarOperario =
    () => {
      const nombre =
        nuevoOperarioNom.trim();

      if (!nombre) {
        return;
      }

      if (
        operarios.some(
          (op) =>
            op
              .toLowerCase()
              .trim() ===
            nombre
              .toLowerCase()
              .trim()
        )
      ) {
        alert(
          'Ese operario ya existe.'
        );

        return;
      }

      setOperarios(
        (prev) => [
          ...prev,
          nombre
        ]
      );

      setNuevoOperarioNom(
        ''
      );
    };


  const borrarOperario = (
    index
  ) => {
    if (
      operarios.length ===
      1
    ) {
      alert(
        'Debe quedar al menos un operario en el sistema.'
      );

      return;
    }

    const nombre =
      operarios[index];

    if (
      !window.confirm(
        `¿Dar de baja a ${nombre}?`
      )
    ) {
      return;
    }

    setOperarios(
      (prev) =>
        prev.filter(
          (_, i) =>
            i !== index
        )
    );
  };


  const getOperarioForDate = (
    fechaStr
  ) => {
    if (
      asignacionesDiarias[
        fechaStr
      ]
    ) {
      return asignacionesDiarias[
        fechaStr
      ];
    }

    const [
      y,
      m,
      d
    ] = fechaStr
      .split('-')
      .map(Number);

    const dateObj =
      new Date(
        y,
        m - 1,
        d
      );

    const dia =
      dateObj.getDay() === 0
        ? 7
        : dateObj.getDay();

    const lunesObj =
      new Date(
        dateObj
      );

    lunesObj.setDate(
      lunesObj.getDate() -
        dia +
        1
    );

    const lunesKey =
      `${lunesObj.getFullYear()}-${String(
        lunesObj.getMonth() +
          1
      ).padStart(
        2,
        '0'
      )}-${String(
        lunesObj.getDate()
      ).padStart(
        2,
        '0'
      )}`;

    if (
      asignacionesSemanales[
        lunesKey
      ]
    ) {
      return asignacionesSemanales[
        lunesKey
      ];
    }

    lunesObj.setHours(
      0,
      0,
      0,
      0
    );

    const referencia =
      new Date(
        2024,
        0,
        1
      );

    referencia.setHours(
      0,
      0,
      0,
      0
    );

    const semanas =
      Math.floor(
        (
          lunesObj.getTime() -
          referencia.getTime()
        ) /
          (
            7 *
            24 *
            60 *
            60 *
            1000
          )
      );

    if (
      operarios.length ===
      0
    ) {
      return 'Sin Personal';
    }

    return operarios[
      (
        (
          semanas %
          operarios.length
        ) +
        operarios.length
      ) %
        operarios.length
    ];
  };


  const obtenerNotaTarea = (
    fecha,
    tarea,
    index
  ) => {
    if (tarea.id) {
      const idNuevo =
        `${fecha}-id-${tarea.id}`;

      if (
        notasTareas[
          idNuevo
        ] !== undefined
      ) {
        return notasTareas[
          idNuevo
        ];
      }
    }

    const legacyId =
      `${fecha}-t-${index}-${tarea.eq}`;

    return (
      notasTareas[
        legacyId
      ] || ''
    );
  };


  const mesActualFiltro =
    `${fechaPantalla.getFullYear()}-${String(
      fechaPantalla.getMonth() +
        1
    ).padStart(2, '0')}`;


  const estadisticasMes =
    useMemo(() => {
      let total = 0;
      let completados = 0;

      Object.entries(
        agendaPorFecha
      ).forEach(
        ([
          fecha,
          lista
        ]) => {
          if (
            !fecha.startsWith(
              mesActualFiltro
            )
          ) {
            return;
          }

          (
            Array.isArray(
              lista
            )
              ? lista
              : []
          ).forEach(
            (tarea) => {
              total++;

              if (
                tarea.estado ===
                'Completado'
              ) {
                completados++;
              }
            }
          );
        }
      );

      const pendientes =
        Math.max(
          total -
            completados,
          0
        );

      const porcentaje =
        total > 0
          ? Math.round(
              (
                completados /
                total
              ) * 100
            )
          : 0;

      return {
        total,
        completados,
        pendientes,
        porcentaje
      };
    }, [
      agendaPorFecha,
      mesActualFiltro
    ]);


  const fallasMesActual =
    useMemo(() => {
      const registros =
        [];

      Object.entries(
        agendaPorFecha
      ).forEach(
        ([
          fecha,
          lista
        ]) => {
          if (
            !fecha.startsWith(
              mesActualFiltro
            )
          ) {
            return;
          }

          const operario =
            getOperarioForDate(
              fecha
            );

          (
            Array.isArray(
              lista
            )
              ? lista
              : []
          ).forEach(
            (
              tarea,
              index
            ) => {
              const obs =
                obtenerNotaTarea(
                  fecha,
                  tarea,
                  index
                );

              if (
                obs &&
                obs.trim()
              ) {
                registros.push({
                  fecha,

                  maquina:
                    tarea.eq,

                  sector:
                    tarea.cl,

                  observacion:
                    obs,

                  operario
                });
              }
            }
          );
        }
      );

      return registros.sort(
        (a, b) =>
          b.fecha.localeCompare(
            a.fecha
          )
      );
    }, [
      agendaPorFecha,
      notasTareas,
      asignacionesDiarias,
      asignacionesSemanales,
      mesActualFiltro,
      operarios
    ]);


  const formatearFechaDisplay = (
    fecha
  ) => {
    const dia = String(
      fecha.getDate()
    ).padStart(2, '0');

    const mes = String(
      fecha.getMonth() +
        1
    ).padStart(2, '0');

    return `${dia}/${mes}/${fecha.getFullYear()}`;
  };


  return (
    <main className="yamaha-main supervisor-main">

      <div className="supervisor-tabs-container">

        <button
          type="button"
          className={`tab-supervisor ${
            subVista ===
            'gestion'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setSubVista(
              'gestion'
            )
          }
        >
          ▦ Dashboard
        </button>

        <button
          type="button"
          className={`tab-supervisor ${
            subVista ===
            'tareas-diarias'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setSubVista(
              'tareas-diarias'
            )
          }
        >
          ✅ Tareas diarias
        </button>

        <button
          type="button"
          className={`tab-supervisor ${
            subVista ===
            'auditoria'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setSubVista(
              'auditoria'
            )
          }
        >
          📋 Preventivos
        </button>

        <button
          type="button"
          className={`tab-supervisor ${
            subVista ===
            'banco'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setSubVista(
              'banco'
            )
          }
        >
          ⚙ Maestro de Equipos
        </button>

      </div>


      {subVista ===
        'tareas-diarias' && (

        <SupervisorTareasDiarias
          fechaPantalla={
            fechaPantalla
          }
          setFechaPantalla={
            setFechaPantalla
          }
          pantallaStr={
            pantallaStr
          }
          operarios={
            operarios
          }
        />

      )}


      {subVista ===
        'auditoria' && (

        <AuditoriaView
          bancoPreventivos={
            bancoPreventivos
          }
          agendaPorFecha={
            agendaPorFecha
          }
          fechaPantalla={
            fechaPantalla
          }
          setFechaPantalla={
            setFechaPantalla
          }
          getOperarioForDate={
            getOperarioForDate
          }
        />

      )}


      {subVista ===
        'banco' && (

        <div className="banco-maestro-container">

          <section className="creador-preventivo-card">

            <div className="creador-header">

              <span className="section-eyebrow">
                MAESTRO DE EQUIPOS
              </span>

              <h3>
                Registrar nuevo equipo
              </h3>

              <p>
                Agregá la máquina,
                sector, imagen y
                procedimiento
                correspondiente.
              </p>

            </div>

            <form
              onSubmit={
                guardarNuevoPreventivo
              }
              className="form-creador-grid"
            >

              <div className="columna-foto">

                <label className="image-upload-box">

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleImageUpload
                    }
                    hidden
                  />

                  {nuevoImg ? (

                    <div className="upload-preview-container">

                      <img
                        src={
                          nuevoImg
                        }
                        alt="Vista previa"
                        className="upload-preview"
                      />

                      <div className="upload-overlay">
                        Cambiar imagen
                      </div>

                    </div>

                  ) : (

                    <div className="upload-placeholder">

                      <span className="upload-plus">
                        +
                      </span>

                      <strong>
                        Subir fotografía
                      </strong>

                      <small>
                        JPG, PNG o WEBP
                      </small>

                    </div>

                  )}

                </label>

              </div>

              <div className="columna-datos">

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Nombre del equipo
                    </label>

                    <input
                      type="text"
                      value={
                        nuevoEquipo
                      }
                      onChange={(e) =>
                        setNuevoEquipo(
                          e.target.value
                        )
                      }
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Sector / Área
                    </label>

                    <input
                      type="text"
                      value={
                        nuevoSector
                      }
                      onChange={(e) =>
                        setNuevoSector(
                          e.target.value
                        )
                      }
                      required
                    />

                  </div>

                </div>

                <div className="form-group">

                  <label>
                    Procedimiento
                  </label>

                  <input
                    type="text"
                    value={
                      nuevoExcel
                    }
                    onChange={(e) =>
                      setNuevoExcel(
                        e.target.value
                      )
                    }
                    placeholder="/planillas.xlsx"
                  />

                  <small className="form-help">
                    Podés usar
                    /planillas.xlsx o una
                    URL externa.
                  </small>

                </div>

                <button
                  type="submit"
                  className="btn-guardar-banco"
                >
                  + Registrar equipo
                </button>

              </div>

            </form>

          </section>


          <section className="lista-banco-existente">

            <div className="section-heading-row">

              <div>

                <span className="section-eyebrow">
                  BASE ACTUAL
                </span>

                <h3>
                  Equipos registrados
                </h3>

              </div>

              <span className="counter-badge">
                {
                  bancoPreventivos.length
                }{' '}
                equipos
              </span>

            </div>

            <div className="grid-preventivos mini">

              {bancoPreventivos.map(
                (
                  prev,
                  idx
                ) => (

                  <article
                    key={
                      prev.id ||
                      `${prev.eq}-${idx}`
                    }
                    className="card-tarea equipment-card"
                  >

                    <div className="card-imagen-container">

                      <img
                        src={
                          prev.img
                        }
                        alt={
                          prev.eq
                        }
                        className="card-imagen"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            'none';
                        }}
                      />

                      <button
                        type="button"
                        className="btn-eliminar-card"
                        onClick={() =>
                          borrarDelBancoMaestro(
                            idx
                          )
                        }
                        title="Eliminar equipo"
                      >
                        🗑
                      </button>

                    </div>

                    <div className="card-body">

                      <h3 className="equipo-titulo">
                        {prev.eq}
                      </h3>

                      <p className="cliente-subtitulo">
                        {prev.cl}
                      </p>

                      <div className="equipment-meta">

                        {prev.excel ? (

                          <span className="meta-ok">
                            ✓ Procedimiento
                            disponible
                          </span>

                        ) : (

                          <span className="meta-warning">
                            ⚠ Sin
                            procedimiento
                          </span>

                        )}

                      </div>

                    </div>

                  </article>

                )
              )}

            </div>

          </section>

        </div>

      )}


      {subVista ===
        'gestion' && (

        <>

          <section className="dashboard-heading">

            <div>

              <span className="section-eyebrow">
                CONTROL DE MANTENIMIENTO
              </span>

              <h2>
                Panel de supervisión
              </h2>

              <p>
                Estado general de
                preventivos y fallas.
              </p>

            </div>

            <div className="dashboard-date-badge">

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


          {/* =========================
              RESUMEN MENSUAL
          ========================= */}

          <section className="dashboard-section">

            <div className="dashboard-section-title">

              <div>

                <span className="section-eyebrow">
                  RESUMEN MENSUAL
                </span>

                <h3>
                  Estado general del mes
                </h3>

              </div>

              <span className="period-badge">
                {mesActualFiltro}
              </span>

            </div>


            <div className="kpi-grid monthly-kpis">

              <div className="kpi-card">

                <div className="kpi-icon">
                  📋
                </div>

                <div>

                  <span className="kpi-label">
                    Preventivos del mes
                  </span>

                  <strong className="kpi-value">
                    {
                      estadisticasMes.total
                    }
                  </strong>

                </div>

              </div>


              <div className="kpi-card success">

                <div className="kpi-icon">
                  ✓
                </div>

                <div>

                  <span className="kpi-label">
                    Completados del mes
                  </span>

                  <strong className="kpi-value">
                    {
                      estadisticasMes.completados
                    }
                  </strong>

                </div>

              </div>


              <div className="kpi-card warning">

                <div className="kpi-icon">
                  !
                </div>

                <div>

                  <span className="kpi-label">
                    Pendientes del mes
                  </span>

                  <strong className="kpi-value">
                    {
                      estadisticasMes.pendientes
                    }
                  </strong>

                </div>

              </div>


              <div className="kpi-card progress">

                <div className="kpi-icon">
                  %
                </div>

                <div>

                  <span className="kpi-label">
                    Cumplimiento mensual
                  </span>

                  <strong className="kpi-value">
                    {
                      estadisticasMes.porcentaje
                    }
                    %
                  </strong>

                </div>

              </div>


              <div className="kpi-card danger">

                <div className="kpi-icon">
                  ⚠
                </div>

                <div>

                  <span className="kpi-label">
                    Observaciones / Fallas
                  </span>

                  <strong className="kpi-value">
                    {
                      fallasMesActual.length
                    }
                  </strong>

                </div>

              </div>

            </div>


            <div className="monthly-progress-card">

              <div className="monthly-progress-header">

                <div>

                  <span>
                    Cumplimiento mensual
                  </span>

                  <small>
                    {
                      estadisticasMes.completados
                    }{' '}
                    de{' '}
                    {
                      estadisticasMes.total
                    }{' '}
                    preventivos completados
                  </small>

                </div>

                <strong>
                  {
                    estadisticasMes.porcentaje
                  }
                  %
                </strong>

              </div>

              <div className="monthly-progress-bar">

                <div
                  style={{
                    width:
                      `${estadisticasMes.porcentaje}%`
                  }}
                />

              </div>

            </div>

          </section>


          {/* =========================
              ESTADO DEL DÍA
          ========================= */}

          <section className="dashboard-section daily-section">

            <div className="dashboard-section-title">

              <div>

                <span className="section-eyebrow">
                  ESTADO DEL DÍA
                </span>

                <h3>
                  Preventivos de hoy
                </h3>

              </div>

              <span className="period-badge">
                {formatearFechaDisplay(
                  fechaPantalla
                )}
              </span>

            </div>


            <div className="kpi-grid daily-kpis">

              <div className="kpi-card">

                <div className="kpi-icon">
                  🛠
                </div>

                <div>

                  <span className="kpi-label">
                    Preventivos hoy
                  </span>

                  <strong className="kpi-value">
                    {
                      tareasDelDia.length
                    }
                  </strong>

                </div>

              </div>


              <div className="kpi-card success">

                <div className="kpi-icon">
                  ✓
                </div>

                <div>

                  <span className="kpi-label">
                    Completados hoy
                  </span>

                  <strong className="kpi-value">
                    {
                      completadasHoy
                    }
                  </strong>

                </div>

              </div>


              <div className="kpi-card warning">

                <div className="kpi-icon">
                  !
                </div>

                <div>

                  <span className="kpi-label">
                    Pendientes hoy
                  </span>

                  <strong className="kpi-value">
                    {
                      pendientesHoy
                    }
                  </strong>

                </div>

              </div>


              <div className="kpi-card progress">

                <div className="kpi-icon">
                  %
                </div>

                <div>

                  <span className="kpi-label">
                    Cumplimiento del día
                  </span>

                  <strong className="kpi-value">
                    {porcentajeHoy}%
                  </strong>

                </div>

              </div>

            </div>

          </section>


          {/* =========================
              ROTACIÓN SEMANAL
          ========================= */}

          <section className="panel-timeline">

            <div className="panel-section-header">

              <div>

                <span className="section-eyebrow">
                  PERSONAL
                </span>

                <h3>
                  Rotación semanal
                </h3>

              </div>

              <button
                type="button"
                onClick={() =>
                  setModalOperarios(
                    true
                  )
                }
                className="btn-secondary"
              >
                👥 Gestionar personal
              </button>

            </div>


            <div className="timeline-boxes">

              <div className="timeline-box">

                <span className="label">
                  SEMANA ANTERIOR
                </span>

                <strong>
                  {
                    operarioSemanaAnterior
                  }
                </strong>

              </div>

              <div className="timeline-box current">

                <span className="label">
                  SEMANA ACTUAL
                </span>

                <strong>
                  {
                    operarioSemanaActual
                  }
                </strong>

              </div>

              <div className="timeline-box">

                <span className="label">
                  PRÓXIMA SEMANA
                </span>

                <strong>
                  {
                    operarioProximaSemana
                  }
                </strong>

              </div>

            </div>

          </section>


          {/* =========================
              CONTROL DEL DÍA
          ========================= */}

          <section className="panel-control-dia">

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
                  value={
                    pantallaStr
                  }
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


            <div className="controles-supervisores-duales">

              <div className="selector-wrapper">

                <label>
                  RESPONSABLE SEMANAL
                </label>

                <select
                  value={
                    operarioSemanaActual
                  }
                  onChange={(e) =>
                    cambiarOperarioSemana(
                      e.target.value
                    )
                  }
                  className="select-normal"
                >

                  {operarios.map(
                    (op) => (

                      <option
                        key={op}
                        value={op}
                      >
                        {op}
                      </option>

                    )
                  )}

                </select>

              </div>


              <div className="selector-wrapper">

                <label>
                  EXCEPCIÓN DEL DÍA
                </label>

                <select
                  value={
                    operarioDelDia
                  }
                  onChange={(e) =>
                    cambiarOperarioDiario(
                      e.target.value
                    )
                  }
                  className="select-normal"
                >

                  {operarios.map(
                    (op) => (

                      <option
                        key={op}
                        value={op}
                      >
                        {op}
                      </option>

                    )
                  )}

                </select>

              </div>

            </div>

          </section>


          {!esFinDeSemana && (

            <div className="barra-acciones-dia">

              <div>

                <span className="section-eyebrow">
                  PLANIFICACIÓN
                </span>

                <h3>
                  Preventivos del día
                </h3>

              </div>

              <button
                type="button"
                className="btn-agregar-preventivo"
                onClick={() =>
                  setModalAgregarAbierto(
                    true
                  )
                }
              >
                + Asignar preventivo
              </button>

            </div>

          )}


          {!esFinDeSemana && (

            <div className="grid-preventivos">

              {tareasDelDia.map(
                (
                  tarea,
                  index
                ) => {

                  const completado =
                    tarea.estado ===
                    'Completado';

                  return (

                    <article
                      key={
                        tarea.id ||
                        `${tarea.eq}-${index}`
                      }
                      className={`card-tarea ${
                        completado
                          ? 'completado'
                          : 'pendiente'
                      }`}
                    >

                      <div className="card-imagen-container">

                        <img
                          src={
                            tarea.img
                          }
                          alt={
                            tarea.eq
                          }
                          className="card-imagen"
                          onError={(e) => {
                            e.currentTarget.style.display =
                              'none';
                          }}
                        />

                        <div className="card-image-overlay" />

                        <span className="tarea-numero">
                          TAREA{' '}
                          {index + 1}
                        </span>

                        <div className="badges-top-right">

                          <span
                            className={`status-pill ${
                              completado
                                ? 'success'
                                : 'warning'
                            }`}
                          >
                            {completado
                              ? '✓ Completado'
                              : 'Pendiente'}
                          </span>

                          <button
                            type="button"
                            className="btn-eliminar-card"
                            onClick={() =>
                              eliminarPreventivo(
                                index
                              )
                            }
                            aria-label="Eliminar preventivo"
                          >
                            🗑
                          </button>

                        </div>

                      </div>


                      <div className="card-body">

                        {editandoTareaIndex ===
                        index ? (

                          <div className="modo-edicion">

                            <label className="section-label-small">
                              CAMBIAR EQUIPO
                            </label>

                            <select
                              className="edicion-select"
                              value={
                                seleccionIndexBanco
                              }
                              onChange={(e) =>
                                setSeleccionIndexBanco(
                                  e.target.value
                                )
                              }
                            >

                              <option value="">
                                -- Seleccionar --
                              </option>

                              {bancoPreventivos.map(
                                (
                                  item,
                                  idx
                                ) => (

                                  <option
                                    key={
                                      item.id ||
                                      idx
                                    }
                                    value={
                                      idx
                                    }
                                  >
                                    {
                                      item.eq
                                    }
                                  </option>

                                )
                              )}

                            </select>

                            <div className="edicion-acciones">

                              <button
                                type="button"
                                className="btn-guardar"
                                onClick={() =>
                                  guardarIntercambio(
                                    index
                                  )
                                }
                              >
                                Guardar
                              </button>

                              <button
                                type="button"
                                className="btn-cancelar"
                                onClick={() => {
                                  setEditandoTareaIndex(
                                    null
                                  );

                                  setSeleccionIndexBanco(
                                    ''
                                  );
                                }}
                              >
                                Cancelar
                              </button>

                            </div>

                          </div>

                        ) : (

                          <>

                            <h3 className="equipo-titulo">
                              {
                                tarea.eq
                              }
                            </h3>

                            <p className="cliente-subtitulo">
                              {
                                tarea.cl
                              }
                            </p>


                            {completado &&
                              tarea.completadoPor && (

                                <div className="completion-info compact">

                                  <span className="completion-icon">
                                    ✓
                                  </span>

                                  <div>

                                    <span>
                                      Registrado por
                                    </span>

                                    <strong>
                                      {
                                        tarea.completadoPor
                                      }
                                    </strong>

                                  </div>

                                </div>

                              )}


                            <div className="card-actions-row">

                              {tarea.excel && (

                                <a
                                  href={
                                    tarea.excel
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn-ver-excel compact"
                                >
                                  📄 Procedimiento
                                </a>

                              )}

                              <button
                                type="button"
                                className="btn-editar-link"
                                onClick={() => {
                                  setEditandoTareaIndex(
                                    index
                                  );

                                  setSeleccionIndexBanco(
                                    ''
                                  );
                                }}
                              >
                                🔄 Cambiar
                              </button>

                            </div>

                          </>

                        )}

                      </div>

                    </article>

                  );
                }
              )}


              {tareasDelDia.length ===
                0 && (

                <div className="empty-state grid-empty">

                  <h3>
                    Día sin preventivos
                  </h3>

                  <p>
                    No hay tareas
                    programadas.
                  </p>

                </div>

              )}

            </div>

          )}


          {/* =========================
              FALLAS DEL MES
          ========================= */}

          <section className="tabla-auditoria-container fallas-panel">

            <div className="table-section-header">

              <div>

                <span className="section-eyebrow danger-text">
                  SEGUIMIENTO
                </span>

                <h3>
                  Observaciones y fallas
                  del mes
                </h3>

              </div>

              <span className="counter-badge danger">
                {
                  fallasMesActual.length
                }{' '}
                registros
              </span>

            </div>

            <div className="table-scroll">

              <table className="tabla-auditoria">

                <thead>

                  <tr>
                    <th>
                      Fecha
                    </th>

                    <th>
                      Equipo
                    </th>

                    <th>
                      Responsable
                    </th>

                    <th>
                      Observación / Falla
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {fallasMesActual.length ===
                  0 ? (

                    <tr>

                      <td
                        colSpan="4"
                        className="empty-table-cell"
                      >
                        No hay observaciones
                        registradas este mes.
                      </td>

                    </tr>

                  ) : (

                    fallasMesActual.map(
                      (
                        registro,
                        index
                      ) => (

                        <tr
                          key={
                            `${registro.fecha}-${registro.maquina}-${index}`
                          }
                        >

                          <td>
                            <strong>
                              {
                                registro.fecha
                              }
                            </strong>
                          </td>

                          <td>

                            <strong>
                              {
                                registro.maquina
                              }
                            </strong>

                            <br />

                            <span className="sub-sector">
                              {
                                registro.sector
                              }
                            </span>

                          </td>

                          <td>

                            <span className="badge-operario">
                              {
                                registro.operario
                              }
                            </span>

                          </td>

                          <td>

                            <span className="texto-observacion-tabla">
                              ⚠{' '}
                              {
                                registro.observacion
                              }
                            </span>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </section>

        </>

      )}


      {/* =========================
          MODAL PERSONAL
      ========================= */}

      {modalOperarios && (

        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              setModalOperarios(
                false
              );
            }
          }}
        >

          <div className="modal-content">

            <div className="modal-header">

              <div>

                <span className="section-eyebrow">
                  PERSONAL
                </span>

                <h3>
                  Administrar operarios
                </h3>

              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setModalOperarios(
                    false
                  )
                }
              >
                ×
              </button>

            </div>


            <div className="lista-operarios-modal">

              {operarios.map(
                (
                  op,
                  index
                ) => (

                  <div
                    className="operario-list-item"
                    key={op}
                  >

                    <div className="operario-avatar">
                      {op
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <span>
                      {op}
                    </span>

                    <button
                      type="button"
                      className="btn-remove-person"
                      onClick={() =>
                        borrarOperario(
                          index
                        )
                      }
                    >
                      ×
                    </button>

                  </div>

                )
              )}

            </div>


            <div className="add-person-row">

              <input
                type="text"
                value={
                  nuevoOperarioNom
                }
                onChange={(e) =>
                  setNuevoOperarioNom(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key ===
                    'Enter'
                  ) {
                    agregarOperario();
                  }
                }}
                placeholder="Nombre del nuevo operario"
              />

              <button
                type="button"
                className="btn-primary"
                onClick={
                  agregarOperario
                }
              >
                Añadir
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =========================
          MODAL ASIGNAR PREVENTIVO
      ========================= */}

      {modalAgregarAbierto && (

        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              setModalAgregarAbierto(
                false
              );
            }
          }}
        >

          <div className="modal-content">

            <div className="modal-header">

              <div>

                <span className="section-eyebrow">
                  PLANIFICACIÓN
                </span>

                <h3>
                  Asignar preventivo
                </h3>

              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setModalAgregarAbierto(
                    false
                  )
                }
              >
                ×
              </button>

            </div>


            <select
              className="edicion-select"
              value={
                itemNuevoIndex
              }
              onChange={(e) =>
                setItemNuevoIndex(
                  e.target.value
                )
              }
            >

              <option value="">
                -- Seleccionar equipo --
              </option>

              {bancoPreventivos.map(
                (
                  item,
                  idx
                ) => (

                  <option
                    key={
                      item.id ||
                      idx
                    }
                    value={idx}
                  >
                    {item.eq}
                  </option>

                )
              )}

            </select>


            <div className="edicion-acciones">

              <button
                type="button"
                className="btn-guardar"
                onClick={
                  agregarPreventivo
                }
              >
                Asignar
              </button>

              <button
                type="button"
                className="btn-cancelar"
                onClick={() => {
                  setModalAgregarAbierto(
                    false
                  );

                  setItemNuevoIndex(
                    ''
                  );
                }}
              >
                Cancelar
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}
