import React, { useEffect, useState } from 'react';
import LoginView from './LoginView';
import OperarioView from './OperarioView';
import SupervisorView from './SupervisorView';
import ExcelPreventivoView from './ExcelPreventivoView';
import './DashboardYamaha.css';

const PREVENTIVOS_BASE = [
  [6, 'Línea A (Panel, Fuerza Motriz, Clamps).'],
  [7, 'Marcadora Línea A'],
  [8, 'Prensa Línea A'],
  [9, 'Brazo Ingrávido DALMEC No.3'],
  [10, 'Inyectora de liquido de freno N°1'],
  [11, 'Inyectora de liquido de freno ABS'],
  [12, 'Inyectora Refrigerante'],
  [13, 'Máquina Inyectora de Combustible N°1(Neumática)'],
  [14, 'Dinamometro A'],
  [15, 'Plataformas Lextral.'],
  [16, 'Línea de producción (Línea A)'],
  [17, 'Línea B (Fuerza Motriz y Central Hidráulica).'],
  [18, 'Prensa No.2'],
  [19, 'Marcadora B (telesis TMP3200/TMC420)'],
  [20, 'Marcadora portatil'],
  [21, 'Brazo Ingrávido DALMEC No.2'],
  [22, 'Brazo Ingrávido RAKU-RAKU'],
  [23, 'Máquina Inyectora de Líquido de Frenos N°2'],
  [24, 'Máquina Inyectora de Combustible N°2 (Eléctrica)'],
  [25, 'Tanque de Traspaso de Combustible'],
  [26, 'Aparejo (Descenso de unidades línea)'],
  [27, 'Carros de Línea B (Piezas, MC y Clamps)'],
  [28, 'Línea de producción (Línea B)'],
  [29, 'FR de Linea B'],
  [30, 'Banco de Baterías'],
  [31, 'Dinamómetro B'],
  [32, 'Dinamómetro ATV'],
  [34, 'Prensa Ruedas (Neumática)'],
  [35, 'Prensa No.1'],
  [36, 'Prensa ATV'],
  [37, 'Prensa Horquillones 1'],
  [38, 'Prensa Horquillones 2'],
  [39, 'Plataforma AlmatecCKD Horquillas'],
  [40, 'Plataforma de ruedas CKD'],
  [41, 'Plataforma AlmatecCKD Motores'],
  [42, 'Brazo Ingrávido DALMEC No.1'],
  [43, 'Carro Motores'],
  [44, 'Dispositivos de equipos de izaje (Ganchos y Eslingas)'],
  [46, 'BER 1 Plataforma Elevadoras de MC (Reparaciones)'],
  [47, 'BER 2 Plataforma Elevadoras de MC (Reparaciones)'],
  [48, 'BER 3 Plataforma Elevadoras de MC (Reparaciones)'],
  [49, 'Máquina Succionadora de Combustible 2'],
  [50, 'BEL Plataforma Elevadoras de MC (1) (Packing)'],
  [51, 'BEC 1 Plataforma Elevadoras de MC (Sala Endurance Test)'],
  [52, 'BEC 2 Plataforma Elevadoras de MC(Sala Endurance Test)'],
  [53, 'Auto elevador No.5 (Y)'],
  [54, 'Auto elevador No.7 (T)'],
  [55, 'Auto elevador No.9 (Y)'],
  [56, 'Auto elevador No.10 (Y) (Ex autoelevador 1)'],
  [57, 'Apiladora Eléctrica No.1 (Y)'],
  [58, 'Apiladora Eléctrica No.2 (Y)'],
  [59, 'Cargador de Baterías Apliladores N°1 y N°2.'],
  [60, 'Enfardadoras 1'],
  [61, 'Enfardadoras 2'],
  [62, 'Aparejo Pórtico'],
  [63, 'Plataforma de descarga de contenedores (Eléctrica)'],
  [64, 'Plataforma de descarga de contenedores (Hidráulica)'],
  [
    65,
    'Sistemas de Almacenamiento (tanques Gas-oil x 2 y nafta, bombas de impulsión y sistema de carga, cañerías)'
  ],
  [66, 'Apilador hidráulico Manual (Cantidad 3)'],
  [81, 'Aparejo de taller de mantenimiento no esta en vigencia'],
  [83, 'Aparejo manual de servicio técnico'],
  [84, 'Plataforma Almatec ATV'],
  [85, 'Bandera de chasis (CKD) 1'],
  [86, 'Bandera de chasis (CKD) 2 no esta en vigencia'],
  [88, 'Herramientas eléctricas Angulares'],
  [90, 'Sala de Compresores (Sist. de Filtrado, Pulmones, Secadores)']
];

const BANCO_INICIAL = PREVENTIVOS_BASE.map(
  ([idExcel, eq], index) => ({
    idExcel,
    eq,
    cl: 'Sector Producción',
    img: `https://picsum.photos/seed/yamaha_${index + 1}/500/300`,
    excel: '/planillas.xlsx'
  })
);

const ID_POR_EQUIPO = Object.fromEntries(
  BANCO_INICIAL.map((item) => [
    item.eq,
    item.idExcel
  ])
);

const normalizarBanco = (banco) => {
  if (!Array.isArray(banco)) {
    return BANCO_INICIAL;
  }

  return banco.map((item) => ({
    ...item,

    excel: '/planillas.xlsx',

    idExcel:
      item.idExcel ??
      ID_POR_EQUIPO[item.eq] ??
      null
  }));
};

const OP_INICIALES = [
  'Mauro Barrios',
  'Julian Janowicz',
  'Gabriel Gonzales',
  'Axel Dominguez',
  'Ferro Nicolas'
];

const leerDatosSeguros = (
  key,
  valorPorDefecto = {}
) => {
  try {
    const data = localStorage.getItem(key);

    return data
      ? JSON.parse(data)
      : valorPorDefecto;
  } catch (error) {
    return valorPorDefecto;
  }
};

export default function DashboardYamaha() {
  const [currentUser, setCurrentUser] =
    useState(() =>
      leerDatosSeguros(
        'yamaha_auth_user_v16',
        null
      )
    );

  const [fechaPantalla, setFechaPantalla] =
    useState(new Date());

  const [operarios, setOperarios] =
    useState(() =>
      leerDatosSeguros(
        'yamaha_operarios_v16',
        OP_INICIALES
      )
    );

  const [
    bancoPreventivos,
    setBancoPreventivos
  ] = useState(() => {
    const bancoGuardado =
      leerDatosSeguros(
        'yamaha_banco_v16',
        BANCO_INICIAL
      );

    return normalizarBanco(
      bancoGuardado
    );
  });

  const [
    asignacionesSemanales,
    setAsignacionesSemanales
  ] = useState(() =>
    leerDatosSeguros(
      'yamaha_semanales_v16'
    )
  );

  const [
    asignacionesDiarias,
    setAsignacionesDiarias
  ] = useState(() =>
    leerDatosSeguros(
      'yamaha_diarias_v16'
    )
  );

  const [
    agendaPorFecha,
    setAgendaPorFecha
  ] = useState(() =>
    leerDatosSeguros(
      'yamaha_agenda_v16'
    )
  );

  const [
    notasTareas,
    setNotasTareas
  ] = useState(() =>
    leerDatosSeguros(
      'yamaha_notas_v16'
    )
  );

  useEffect(() => {
    localStorage.setItem(
      'yamaha_auth_user_v16',
      JSON.stringify(currentUser)
    );

    localStorage.setItem(
      'yamaha_operarios_v16',
      JSON.stringify(operarios)
    );

    localStorage.setItem(
      'yamaha_banco_v16',
      JSON.stringify(bancoPreventivos)
    );

    localStorage.setItem(
      'yamaha_semanales_v16',
      JSON.stringify(
        asignacionesSemanales
      )
    );

    localStorage.setItem(
      'yamaha_diarias_v16',
      JSON.stringify(
        asignacionesDiarias
      )
    );

    localStorage.setItem(
      'yamaha_agenda_v16',
      JSON.stringify(agendaPorFecha)
    );

    localStorage.setItem(
      'yamaha_notas_v16',
      JSON.stringify(notasTareas)
    );
  }, [
    currentUser,
    operarios,
    bancoPreventivos,
    asignacionesSemanales,
    asignacionesDiarias,
    agendaPorFecha,
    notasTareas
  ]);

  /*
    AUTOMATIZACIÓN MENSUAL

    Si el mes nuevo todavía no tiene
    tareas, copia las del mes anterior
    respetando los días hábiles.
  */

  useEffect(() => {
    const currentYear =
      fechaPantalla.getFullYear();

    const currentMonth =
      fechaPantalla.getMonth();

    const strMesActual =
      `${currentYear}-${String(
        currentMonth + 1
      ).padStart(2, '0')}`;

    setAgendaPorFecha(
      (prevAgenda) => {
        const yaTieneTareasEsteMes =
          Object.keys(
            prevAgenda
          ).some((key) =>
            key.startsWith(
              strMesActual
            )
          );

        if (
          yaTieneTareasEsteMes
        ) {
          return prevAgenda;
        }

        const prevMonth =
          currentMonth === 0
            ? 11
            : currentMonth - 1;

        const prevYear =
          currentMonth === 0
            ? currentYear - 1
            : currentYear;

        const strMesPasado =
          `${prevYear}-${String(
            prevMonth + 1
          ).padStart(2, '0')}`;

        const tareasPrev =
          Object.keys(
            prevAgenda
          ).filter((key) =>
            key.startsWith(
              strMesPasado
            )
          );

        if (
          tareasPrev.length === 0
        ) {
          return prevAgenda;
        }

        const nuevaAgenda = {
          ...prevAgenda
        };

        let huboClonado = false;
        let diaHabilActual = 0;

        for (
          let i = 1;
          i <= 31;
          i++
        ) {
          const dActual =
            new Date(
              currentYear,
              currentMonth,
              i
            );

          if (
            dActual.getMonth() !==
            currentMonth
          ) {
            break;
          }

          if (
            dActual.getDay() !== 0 &&
            dActual.getDay() !== 6
          ) {
            diaHabilActual++;

            let diaHabilPrev = 0;

            for (
              let j = 1;
              j <= 31;
              j++
            ) {
              const dPrev =
                new Date(
                  prevYear,
                  prevMonth,
                  j
                );

              if (
                dPrev.getMonth() !==
                prevMonth
              ) {
                break;
              }

              if (
                dPrev.getDay() !== 0 &&
                dPrev.getDay() !== 6
              ) {
                diaHabilPrev++;

                if (
                  diaHabilPrev ===
                  diaHabilActual
                ) {
                  const keyPrev =
                    `${dPrev.getFullYear()}-${String(
                      dPrev.getMonth() +
                        1
                    ).padStart(
                      2,
                      '0'
                    )}-${String(
                      dPrev.getDate()
                    ).padStart(
                      2,
                      '0'
                    )}`;

                  if (
                    nuevaAgenda[
                      keyPrev
                    ] &&
                    nuevaAgenda[
                      keyPrev
                    ].length > 0
                  ) {
                    const keyActual =
                      `${dActual.getFullYear()}-${String(
                        dActual.getMonth() +
                          1
                      ).padStart(
                        2,
                        '0'
                      )}-${String(
                        dActual.getDate()
                      ).padStart(
                        2,
                        '0'
                      )}`;

                    nuevaAgenda[
                      keyActual
                    ] =
                      nuevaAgenda[
                        keyPrev
                      ].map(
                        (tarea) => ({
                          ...tarea,
                          estado:
                            'Pendiente'
                        })
                      );

                    huboClonado =
                      true;
                  }

                  break;
                }
              }
            }
          }
        }

        return huboClonado
          ? nuevaAgenda
          : prevAgenda;
      }
    );
  }, [
    fechaPantalla.getFullYear(),
    fechaPantalla.getMonth()
  ]);

  /*
    DETECTAMOS SI ESTA PESTAÑA
    FUE ABIERTA PARA VER UN
    PREVENTIVO DEL EXCEL
  */

  const parametros =
    new URLSearchParams(
      window.location.search
    );

  const preventivoExcelId =
    parametros.get(
      'preventivoExcel'
    );

  const preventivoNombre =
    parametros.get('equipo');

  if (!currentUser) {
    return (
      <LoginView
        onLogin={(user) =>
          setCurrentUser(user)
        }
      />
    );
  }

  /*
    Si existe ?preventivoExcel=...
    mostramos la planilla.
  */

  if (preventivoExcelId) {
    return (
      <ExcelPreventivoView
        idExcel={Number(
          preventivoExcelId
        )}
        nombreEquipo={
          preventivoNombre || ''
        }
      />
    );
  }

  const getLunesSemana = (
    fecha
  ) => {
    const d = new Date(fecha);

    const dia =
      d.getDay() === 0
        ? 7
        : d.getDay();

    d.setDate(
      d.getDate() - dia + 1
    );

    return `${d.getFullYear()}-${String(
      d.getMonth() + 1
    ).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
  };

  const getOperarioSemanaMatematico =
    (fecha) => {
      if (
        !operarios ||
        operarios.length === 0
      ) {
        return 'Sin Personal';
      }

      const d = new Date(fecha);

      const dia =
        d.getDay() === 0
          ? 7
          : d.getDay();

      d.setDate(
        d.getDate() - dia + 1
      );

      d.setHours(
        0,
        0,
        0,
        0
      );

      const fechaBase =
        new Date(
          2024,
          0,
          1
        ).getTime();

      const semanas =
        Math.floor(
          (d.getTime() -
            fechaBase) /
            (
              7 *
              24 *
              60 *
              60 *
              1000
            )
        );

      const index =
        (
          (
            semanas %
            operarios.length
          ) +
          operarios.length
        ) %
        operarios.length;

      return operarios[index];
    };

  const getOperarioPorSemana = (
    fecha,
    offset = 0
  ) => {
    const d = new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate() +
        offset * 7
    );

    return (
      asignacionesSemanales[
        getLunesSemana(d)
      ] ||
      getOperarioSemanaMatematico(
        d
      )
    );
  };

  const pantallaStr =
    `${fechaPantalla.getFullYear()}-${String(
      fechaPantalla.getMonth() +
        1
    ).padStart(2, '0')}-${String(
      fechaPantalla.getDate()
    ).padStart(2, '0')}`;

  const operarioDelDia =
    asignacionesDiarias[
      pantallaStr
    ] ||
    getOperarioPorSemana(
      fechaPantalla,
      0
    );

  const mesActualStr =
    `${fechaPantalla.getFullYear()}-${String(
      fechaPantalla.getMonth() +
        1
    ).padStart(2, '0')}`;

  let tareasMes = 0;
  let completadosMes = 0;

  Object.keys(
    agendaPorFecha
  ).forEach((key) => {
    if (
      key.startsWith(
        mesActualStr
      )
    ) {
      agendaPorFecha[
        key
      ].forEach((tarea) => {
        tareasMes++;

        if (
          tarea.estado ===
          'Completado'
        ) {
          completadosMes++;
        }
      });
    }
  });

  return (
    <div className="yamaha-container">
      <header className="yamaha-header">
        <div className="header-titles">
          <h1>
            YAMAHA MOTOR ARGENTINA
          </h1>

          <h2>
            GESTIÓN INDUSTRIAL
          </h2>
        </div>

        <div className="header-user-info">
          <div className="user-badge-role">
            👤{' '}
            <strong>
              {currentUser.name}
            </strong>
          </div>

          <button
            className="btn-logout"
            onClick={() => {
              setCurrentUser(null);

              localStorage.removeItem(
                'yamaha_auth_user_v16'
              );
            }}
          >
            Salir ⎋
          </button>
        </div>

        <div className="resumen-ejecutivo">
          <span>
            META DEL MES:{' '}
            {completadosMes} /{' '}
            {tareasMes || 1}
          </span>

          <div className="progress-mini">
            <div
              style={{
                width: `${Math.min(
                  (
                    completadosMes /
                    (
                      tareasMes ||
                      1
                    )
                  ) *
                    100,
                  100
                )}%`
              }}
            />
          </div>
        </div>
      </header>

      {currentUser.role ===
      'operario' ? (
        <OperarioView
          fechaPantalla={
            fechaPantalla
          }
          setFechaPantalla={
            setFechaPantalla
          }
          pantallaStr={
            pantallaStr
          }
          operarioDelDia={
            operarioDelDia
          }
          agendaPorFecha={
            agendaPorFecha
          }
          setAgendaPorFecha={
            setAgendaPorFecha
          }
          notasTareas={
            notasTareas
          }
          setNotasTareas={
            setNotasTareas
          }
          bancoPreventivos={
            bancoPreventivos
          }
        />
      ) : (
        <SupervisorView
          fechaPantalla={
            fechaPantalla
          }
          setFechaPantalla={
            setFechaPantalla
          }
          pantallaStr={
            pantallaStr
          }
          operarioSemanaAnterior={getOperarioPorSemana(
            fechaPantalla,
            -1
          )}
          operarioSemanaActual={getOperarioPorSemana(
            fechaPantalla,
            0
          )}
          operarioProximaSemana={getOperarioPorSemana(
            fechaPantalla,
            1
          )}
          operarioDelDia={
            operarioDelDia
          }
          cambiarOperarioSemana={(
            op
          ) =>
            setAsignacionesSemanales(
              (prev) => ({
                ...prev,

                [getLunesSemana(
                  fechaPantalla
                )]: op
              })
            )
          }
          cambiarOperarioDiario={(
            op
          ) =>
            setAsignacionesDiarias(
              (prev) => ({
                ...prev,

                [pantallaStr]:
                  op
              })
            )
          }
          agendaPorFecha={
            agendaPorFecha
          }
          setAgendaPorFecha={
            setAgendaPorFecha
          }
          notasTareas={
            notasTareas
          }
          operarios={operarios}
          setOperarios={
            setOperarios
          }
          bancoPreventivos={
            bancoPreventivos
          }
          setBancoPreventivos={
            setBancoPreventivos
          }
          asignacionesDiarias={
            asignacionesDiarias
          }
          asignacionesSemanales={
            asignacionesSemanales
          }
        />
      )}
    </div>
  );
}