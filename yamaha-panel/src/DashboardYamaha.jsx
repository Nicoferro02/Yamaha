import React, {
  useEffect,
  useMemo,
  useState
} from 'react';

import LoginView from './LoginView';
import OperarioView from './OperarioView';
import SupervisorView from './SupervisorView';
import TareasDiariasView from './TareasDiariasView';

import './DashboardYamaha.css';

const AUTH_KEY =
  'yamaha_auth_user_v16';

const OPERARIOS_KEY =
  'yamaha_operarios_v16';

const BANCO_KEY =
  'yamaha_banco_v16';

const SEMANALES_KEY =
  'yamaha_semanales_v16';

const DIARIAS_KEY =
  'yamaha_diarias_v16';

const AGENDA_KEY =
  'yamaha_agenda_v16';

const NOTAS_KEY =
  'yamaha_notas_v16';


const OPERARIOS_INICIALES = [
  'Mauro Barrios',
  'Julian Janowicz',
  'Gabriel Gonzales',
  'Axel Dominguez',
  'Ferro Nicolas'
];


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
  [65, 'Sistemas de Almacenamiento (tanques Gas-oil x 2 y nafta, bombas de impulsión y sistema de carga, cañerías)'],
  [66, 'Apilador hidráulico Manual (Cantidad 3)'],
  [81, 'Aparejo de taller de mantenimiento no esta en vigencia'],
  [83, 'Aparejo manual de servicio técnico'],
  [84, 'Plataforma Almatec ATV'],
  [85, 'Bandera de chasis (CKD) 1'],
  [86, 'Bandera de chasis (CKD) 2 no esta en vigencia'],
  [88, 'Herramientas eléctricas Angulares'],
  [90, 'Sala de Compresores (Sist. de Filtrado, Pulmones, Secadores)']
];


const BANCO_INICIAL =
  PREVENTIVOS_BASE.map(
    ([id, nombre], index) => ({
      id: `eq_${id}`,
      hoja: id,
      eq: nombre,
      cl: 'Yamaha Motor Argentina',
      img:
        `https://picsum.photos/seed/yamaha-equipo-${index + 1}/900/600`,
      excel:
        '/planillas.xlsx'
    })
  );


function leerLocalStorage(
  key,
  fallback
) {
  try {
    const guardado =
      localStorage.getItem(key);

    if (!guardado) {
      return fallback;
    }

    return JSON.parse(
      guardado
    );
  } catch (error) {
    console.error(
      `Error leyendo ${key}:`,
      error
    );

    return fallback;
  }
}


function guardarLocalStorage(
  key,
  valor
) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(valor)
    );
  } catch (error) {
    console.error(
      `Error guardando ${key}:`,
      error
    );
  }
}


function obtenerFechaLocal(
  fecha = new Date()
) {
  const anio =
    fecha.getFullYear();

  const mes = String(
    fecha.getMonth() + 1
  ).padStart(2, '0');

  const dia = String(
    fecha.getDate()
  ).padStart(2, '0');

  return `${anio}-${mes}-${dia}`;
}


function obtenerLunes(
  fecha
) {
  const copia =
    new Date(fecha);

  copia.setHours(
    0,
    0,
    0,
    0
  );

  const dia =
    copia.getDay() === 0
      ? 7
      : copia.getDay();

  copia.setDate(
    copia.getDate() -
      dia +
      1
  );

  return copia;
}


function sumarDias(
  fecha,
  dias
) {
  const copia =
    new Date(fecha);

  copia.setDate(
    copia.getDate() +
      dias
  );

  return copia;
}


function crearIdTareaPreventiva(
  fechaStr,
  index
) {
  if (
    typeof crypto !==
      'undefined' &&
    typeof crypto.randomUUID ===
      'function'
  ) {
    return crypto.randomUUID();
  }

  return `t_${fechaStr}_${index}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}


function normalizarBanco(
  banco
) {
  if (
    !Array.isArray(banco) ||
    banco.length === 0
  ) {
    return BANCO_INICIAL;
  }

  return banco.map(
    (item, index) => ({
      ...item,

      id:
        item.id ||
        `eq_custom_${index}`,

      cl:
        item.cl ||
        'Yamaha Motor Argentina',

      img:
        item.img ||
        `https://picsum.photos/seed/yamaha-equipo-${index + 1}/900/600`,

      excel:
        '/planillas.xlsx'
    })
  );
}


export default function DashboardYamaha() {
  const [
    currentUser,
    setCurrentUser
  ] = useState(
    () =>
      leerLocalStorage(
        AUTH_KEY,
        null
      )
  );

  const [
    operarios,
    setOperarios
  ] = useState(
    () =>
      leerLocalStorage(
        OPERARIOS_KEY,
        OPERARIOS_INICIALES
      )
  );

  const [
    bancoPreventivos,
    setBancoPreventivos
  ] = useState(
    () =>
      normalizarBanco(
        leerLocalStorage(
          BANCO_KEY,
          BANCO_INICIAL
        )
      )
  );

  const [
    asignacionesSemanales,
    setAsignacionesSemanales
  ] = useState(
    () =>
      leerLocalStorage(
        SEMANALES_KEY,
        {}
      )
  );

  const [
    asignacionesDiarias,
    setAsignacionesDiarias
  ] = useState(
    () =>
      leerLocalStorage(
        DIARIAS_KEY,
        {}
      )
  );

  const [
    agendaPorFecha,
    setAgendaPorFecha
  ] = useState(
    () =>
      leerLocalStorage(
        AGENDA_KEY,
        {}
      )
  );

  const [
    notasTareas,
    setNotasTareas
  ] = useState(
    () =>
      leerLocalStorage(
        NOTAS_KEY,
        {}
      )
  );

  const [
    fechaPantalla,
    setFechaPantalla
  ] = useState(
    () => new Date()
  );


  const pantallaStr =
    obtenerFechaLocal(
      fechaPantalla
    );


  useEffect(() => {
    if (currentUser) {
      guardarLocalStorage(
        AUTH_KEY,
        currentUser
      );
    }
  }, [currentUser]);


  useEffect(() => {
    guardarLocalStorage(
      OPERARIOS_KEY,
      operarios
    );
  }, [operarios]);


  useEffect(() => {
    guardarLocalStorage(
      BANCO_KEY,
      bancoPreventivos
    );
  }, [bancoPreventivos]);


  useEffect(() => {
    guardarLocalStorage(
      SEMANALES_KEY,
      asignacionesSemanales
    );
  }, [
    asignacionesSemanales
  ]);


  useEffect(() => {
    guardarLocalStorage(
      DIARIAS_KEY,
      asignacionesDiarias
    );
  }, [
    asignacionesDiarias
  ]);


  useEffect(() => {
    guardarLocalStorage(
      AGENDA_KEY,
      agendaPorFecha
    );
  }, [agendaPorFecha]);


  useEffect(() => {
    guardarLocalStorage(
      NOTAS_KEY,
      notasTareas
    );
  }, [notasTareas]);


  /*
    Si el mes elegido todavía no tiene tareas
    pero el mes anterior sí, copiamos la misma
    estructura por número de día de semana.

    Importante:
    - el estado vuelve a Pendiente
    - NO se copia quién lo completó
    - NO se copia la fecha de cierre
  */
  useEffect(() => {
    const anio =
      fechaPantalla.getFullYear();

    const mes =
      fechaPantalla.getMonth();

    const prefijoMes =
      `${anio}-${String(
        mes + 1
      ).padStart(2, '0')}`;

    const yaTieneMes =
      Object.keys(
        agendaPorFecha
      ).some(
        (fecha) =>
          fecha.startsWith(
            prefijoMes
          )
      );

    if (yaTieneMes) {
      return;
    }

    const mesAnterior =
      new Date(
        anio,
        mes - 1,
        1
      );

    const prefijoAnterior =
      `${mesAnterior.getFullYear()}-${String(
        mesAnterior.getMonth() +
          1
      ).padStart(2, '0')}`;

    const fechasAnterior =
      Object.keys(
        agendaPorFecha
      ).filter(
        (fecha) =>
          fecha.startsWith(
            prefijoAnterior
          ) &&
          (
            agendaPorFecha[
              fecha
            ] || []
          ).length > 0
      );

    if (
      fechasAnterior.length ===
      0
    ) {
      return;
    }

    const agrupadoPorDia =
      {};

    fechasAnterior.forEach(
      (fechaStr) => {
        const fecha =
          new Date(
            `${fechaStr}T00:00:00`
          );

        const diaSemana =
          fecha.getDay();

        if (
          !agrupadoPorDia[
            diaSemana
          ]
        ) {
          agrupadoPorDia[
            diaSemana
          ] = [];
        }

        agrupadoPorDia[
          diaSemana
        ].push(
          agendaPorFecha[
            fechaStr
          ] || []
        );
      }
    );

    Object.values(
      agrupadoPorDia
    ).forEach(
      (listas) => {
        listas.reverse();
      }
    );

    const diasMes =
      new Date(
        anio,
        mes + 1,
        0
      ).getDate();

    const nuevoMes = {};

    for (
      let dia = 1;
      dia <= diasMes;
      dia++
    ) {
      const fecha =
        new Date(
          anio,
          mes,
          dia
        );

      const diaSemana =
        fecha.getDay();

      if (
        diaSemana === 0 ||
        diaSemana === 6
      ) {
        continue;
      }

      const candidatas =
        agrupadoPorDia[
          diaSemana
        ];

      if (
        !candidatas ||
        candidatas.length === 0
      ) {
        continue;
      }

      const listaBase =
        candidatas[
          (dia - 1) %
            candidatas.length
        ];

      const fechaStr =
        obtenerFechaLocal(
          fecha
        );

      nuevoMes[
        fechaStr
      ] = listaBase.map(
        (tarea, index) => ({
          ...tarea,

          id:
            crearIdTareaPreventiva(
              fechaStr,
              index
            ),

          estado:
            'Pendiente',

          completadoPor:
            null,

          fechaCompletado:
            null,

          excel:
            tarea.excel ||
            '/planillas.xlsx'
        })
      );
    }

    if (
      Object.keys(
        nuevoMes
      ).length > 0
    ) {
      setAgendaPorFecha(
        (prev) => ({
          ...prev,
          ...nuevoMes
        })
      );
    }
  }, [
    fechaPantalla,
    agendaPorFecha
  ]);


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

    const fecha =
      new Date(
        y,
        m - 1,
        d
      );

    const lunes =
      obtenerLunes(fecha);

    const lunesKey =
      obtenerFechaLocal(
        lunes
      );

    if (
      asignacionesSemanales[
        lunesKey
      ]
    ) {
      return asignacionesSemanales[
        lunesKey
      ];
    }

    if (
      operarios.length === 0
    ) {
      return 'Sin Personal';
    }

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
          lunes.getTime() -
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

    const indice =
      (
        (
          semanas %
          operarios.length
        ) +
        operarios.length
      ) %
      operarios.length;

    return operarios[
      indice
    ];
  };


  const obtenerOperarioSemana =
    (offsetSemanas) => {
      const lunesActual =
        obtenerLunes(
          fechaPantalla
        );

      const lunes =
        sumarDias(
          lunesActual,
          offsetSemanas * 7
        );

      return getOperarioForDate(
        obtenerFechaLocal(
          lunes
        )
      );
    };


  const operarioSemanaAnterior =
    obtenerOperarioSemana(-1);

  const operarioSemanaActual =
    obtenerOperarioSemana(0);

  const operarioProximaSemana =
    obtenerOperarioSemana(1);

  const operarioDelDia =
    getOperarioForDate(
      pantallaStr
    );


  const cambiarOperarioSemana = (
    nuevoOperario
  ) => {
    const lunes =
      obtenerLunes(
        fechaPantalla
      );

    const lunesKey =
      obtenerFechaLocal(
        lunes
      );

    setAsignacionesSemanales(
      (prev) => ({
        ...prev,
        [lunesKey]:
          nuevoOperario
      })
    );
  };


  const cambiarOperarioDiario = (
    nuevoOperario
  ) => {
    setAsignacionesDiarias(
      (prev) => ({
        ...prev,
        [pantallaStr]:
          nuevoOperario
      })
    );
  };


  const tareasDiaActual =
    agendaPorFecha[
      pantallaStr
    ] || [];

  const totalHoy =
    tareasDiaActual.length;

  const completadasHoy =
    tareasDiaActual.filter(
      (tarea) =>
        tarea.estado ===
        'Completado'
    ).length;

  const porcentajeHoy =
    totalHoy > 0
      ? Math.round(
          (
            completadasHoy /
            totalHoy
          ) * 100
        )
      : 0;


  const nombreRol =
    currentUser?.role ===
    'supervisor'
      ? 'Supervisor'
      : currentUser?.role ===
          'tareas'
        ? 'Tareas diarias'
        : 'Operario';


  const handleLogin = (
    usuario
  ) => {
    setCurrentUser(
      usuario
    );

    guardarLocalStorage(
      AUTH_KEY,
      usuario
    );
  };


  const handleLogout = () => {
    localStorage.removeItem(
      AUTH_KEY
    );

    setCurrentUser(null);
  };


  if (!currentUser) {
    return (
      <LoginView
        onLogin={handleLogin}
      />
    );
  }


  return (
    <div className="yamaha-container">

      <header className="yamaha-header">

        <div className="header-titles">

          <h1>
            YAMAHA MOTOR
          </h1>

          <h2>
            SISTEMA INTEGRAL DE
            MANTENIMIENTO
          </h2>

        </div>

        <div className="header-user-info">

          <div className="user-badge-role">
            <strong>
              {nombreRol}
            </strong>

            {' · '}

            {currentUser.name}
          </div>

          <button
            type="button"
            className="btn-logout"
            onClick={
              handleLogout
            }
          >
            Salir
          </button>

        </div>

        {currentUser.role ===
          'operario' && (

          <div className="resumen-ejecutivo">

            <span>
              AVANCE DEL DÍA{' '}
              {porcentajeHoy}%
            </span>

            <div className="progress-mini">
              <div
                style={{
                  width:
                    `${porcentajeHoy}%`
                }}
              />
            </div>

          </div>

        )}

      </header>

      {currentUser.role ===
      'supervisor' ? (

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

          operarioSemanaAnterior={
            operarioSemanaAnterior
          }
          operarioSemanaActual={
            operarioSemanaActual
          }
          operarioProximaSemana={
            operarioProximaSemana
          }
          operarioDelDia={
            operarioDelDia
          }

          cambiarOperarioSemana={
            cambiarOperarioSemana
          }
          cambiarOperarioDiario={
            cambiarOperarioDiario
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

          operarios={
            operarios
          }
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

      ) : currentUser.role ===
        'tareas' ? (

        <TareasDiariasView
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

      ) : (

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

      )}

    </div>
  );
}
