import React, { useState, useEffect } from 'react';
import LoginView from './LoginView';
import OperarioView from './OperarioView';
import SupervisorView from './SupervisorView';
import './DashboardYamaha.css';

const BANCO_INICIAL = [
  { eq: 'Línea A (Panel, Fuerza Motriz, Clamps).', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_1/500/300', excel: '/planillas.xlsx' },
  { eq: 'Marcadora Línea A', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_2/500/300', excel: '/planillas.xlsx' },
  { eq: 'Prensa Línea A', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_3/500/300', excel: '/planillas.xlsx' },
  { eq: 'Brazo Ingrávido DALMEC No.3', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_4/500/300', excel: '/planillas.xlsx' },
  { eq: 'Inyectora de liquido de freno N°1', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_5/500/300', excel: '/planillas.xlsx' },
  { eq: 'Inyectora de liquido de freno ABS', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_6/500/300', excel: '/planillas.xlsx' },
  { eq: 'Inyectora Refrigerante', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_7/500/300', excel: '/planillas.xlsx' },
  { eq: 'Máquina Inyectora de Combustible N°1(Neumática)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_8/500/300', excel: '/planillas.xlsx' },
  { eq: 'Dinamometro A', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_9/500/300', excel: '/planillas.xlsx' },
  { eq: 'Plataformas Lextral.', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_10/500/300', excel: '/planillas.xlsx' },
  { eq: 'Línea de producción (Línea A)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_11/500/300', excel: '/planillas.xlsx' },
  { eq: 'Línea B (Fuerza Motriz y Central Hidráulica).', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_12/500/300', excel: '/planillas.xlsx' },
  { eq: 'Prensa No.2', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_13/500/300', excel: '/planillas.xlsx' },
  { eq: 'Marcadora B (telesis TMP3200/TMC420)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_14/500/300', excel: '/planillas.xlsx' },
  { eq: 'Marcadora portatil', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_15/500/300', excel: '/planillas.xlsx' },
  { eq: 'Brazo Ingrávido DALMEC No.2', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_16/500/300', excel: '/planillas.xlsx' },
  { eq: 'Brazo Ingrávido RAKU-RAKU', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_17/500/300', excel: '/planillas.xlsx' },
  { eq: 'Máquina Inyectora de Líquido de Frenos N°2', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_18/500/300', excel: '/planillas.xlsx' },
  { eq: 'Máquina Inyectora de Combustible N°2 (Eléctrica)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_19/500/300', excel: '/planillas.xlsx' },
  { eq: 'Tanque de Traspaso de Combustible', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_20/500/300', excel: '/planillas.xlsx' },
  { eq: 'Aparejo (Descenso de unidades línea)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_21/500/300', excel: '/planillas.xlsx' },
  { eq: 'Carros de Línea B (Piezas, MC y Clamps)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_22/500/300', excel: '/planillas.xlsx' },
  { eq: 'Línea de producción (Línea B)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_23/500/300', excel: '/planillas.xlsx' },
  { eq: 'FR de Linea B', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_24/500/300', excel: '/planillas.xlsx' },
  { eq: 'Banco de Baterías', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_25/500/300', excel: '/planillas.xlsx' },
  { eq: 'Dinamómetro B', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_26/500/300', excel: '/planillas.xlsx' },
  { eq: 'Dinamómetro ATV', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_27/500/300', excel: '/planillas.xlsx' },
  { eq: 'Prensa Ruedas (Neumática)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_28/500/300', excel: '/planillas.xlsx' },
  { eq: 'Prensa No.1', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_29/500/300', excel: '/planillas.xlsx' },
  { eq: 'Prensa ATV', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_30/500/300', excel: '/planillas.xlsx' },
  { eq: 'Prensa Horquillones 1', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_31/500/300', excel: '/planillas.xlsx' },
  { eq: 'Prensa Horquillones 2', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_32/500/300', excel: '/planillas.xlsx' },
  { eq: 'Plataforma AlmatecCKD Horquillas', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_33/500/300', excel: '/planillas.xlsx' },
  { eq: 'Plataforma de ruedas CKD', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_34/500/300', excel: '/planillas.xlsx' },
  { eq: 'Plataforma AlmatecCKD Motores', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_35/500/300', excel: '/planillas.xlsx' },
  { eq: 'Brazo Ingrávido DALMEC No.1', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_36/500/300', excel: '/planillas.xlsx' },
  { eq: 'Carro Motores', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_37/500/300', excel: '/planillas.xlsx' },
  { eq: 'Dispositivos de equipos de izaje (Ganchos y Eslingas)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_38/500/300', excel: '/planillas.xlsx' },
  { eq: 'BER 1 Plataforma Elevadoras de MC (Reparaciones)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_39/500/300', excel: '/planillas.xlsx' },
  { eq: 'BER 2 Plataforma Elevadoras de MC (Reparaciones)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_40/500/300', excel: '/planillas.xlsx' },
  { eq: 'BER 3 Plataforma Elevadoras de MC (Reparaciones)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_41/500/300', excel: '/planillas.xlsx' },
  { eq: 'Máquina Succionadora de Combustible 2', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_42/500/300', excel: '/planillas.xlsx' },
  { eq: 'BEL Plataforma Elevadoras de MC (1) (Packing)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_43/500/300', excel: '/planillas.xlsx' },
  { eq: 'BEC 1 Plataforma Elevadoras de MC (Sala Endurance Test)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_44/500/300', excel: '/planillas.xlsx' },
  { eq: 'BEC 2 Plataforma Elevadoras de MC(Sala Endurance Test)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_45/500/300', excel: '/planillas.xlsx' },
  { eq: 'Auto elevador No.5 (Y)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_46/500/300', excel: '/planillas.xlsx' },
  { eq: 'Auto elevador No.7 (T)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_47/500/300', excel: '/planillas.xlsx' },
  { eq: 'Auto elevador No.9 (Y)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_48/500/300', excel: '/planillas.xlsx' },
  { eq: 'Auto elevador No.10 (Y) (Ex autoelevador 1)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_49/500/300', excel: '/planillas.xlsx' },
  { eq: 'Apiladora Eléctrica No.1 (Y)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_50/500/300', excel: '/planillas.xlsx' },
  { eq: 'Apiladora Eléctrica No.2 (Y)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_51/500/300', excel: '/planillas.xlsx' },
  { eq: 'Cargador de Baterías Apliladores N°1 y N°2.', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_52/500/300', excel: '/planillas.xlsx' },
  { eq: 'Enfardadoras 1', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_53/500/300', excel: '/planillas.xlsx' },
  { eq: 'Enfardadoras 2', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_54/500/300', excel: '/planillas.xlsx' },
  { eq: 'Aparejo Pórtico', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_55/500/300', excel: '/planillas.xlsx' },
  { eq: 'Plataforma de descarga de contenedores (Eléctrica)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_56/500/300', excel: '/planillas.xlsx' },
  { eq: 'Plataforma de descarga de contenedores (Hidráulica)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_57/500/300', excel: '/planillas.xlsx' },
  { eq: 'Sistemas de Almacenamiento (tanques Gas-oil x 2 y nafta, bombas de impulsión y sistema de carga, cañerías)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_58/500/300', excel: '/planillas.xlsx' },
  { eq: 'Apilador hidráulico Manual (Cantidad 3)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_59/500/300', excel: '/planillas.xlsx' },
  { eq: 'Aparejo de taller de mantenimiento no esta en vigencia', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_60/500/300', excel: '/planillas.xlsx' },
  { eq: 'Aparejo manual de servicio técnico', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_61/500/300', excel: '/planillas.xlsx' },
  { eq: 'Plataforma Almatec ATV', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_62/500/300', excel: '/planillas.xlsx' },
  { eq: 'Bandera de chasis (CKD) 1', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_63/500/300', excel: '/planillas.xlsx' },
  { eq: 'Bandera de chasis (CKD) 2 no esta en vigencia', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_64/500/300', excel: '/planillas.xlsx' },
  { eq: 'Herramientas eléctricas Angulares', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_65/500/300', excel: '/planillas.xlsx' },
  { eq: 'Sala de Compresores (Sist. de Filtrado, Pulmones, Secadores)', cl: 'Sector Producción', img: 'https://picsum.photos/seed/yamaha_66/500/300', excel: '/planillas.xlsx' }
];

const OP_INICIALES = [
  'Mauro Barrios',
  'Julian Janowicz',
  'Gabriel Gonzales',
  'Axel Dominguez',
  'Ferro Nicolas'
];

const leerDatosSeguros = (key, valorPorDefecto = {}) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : valorPorDefecto;
  } catch {
    return valorPorDefecto;
  }
};

const normalizarBanco = (banco) => {
  if (!Array.isArray(banco)) {
    return BANCO_INICIAL;
  }

  return banco.map((item) => ({
    ...item,
    excel: '/planillas.xlsx'
  }));
};

export default function DashboardYamaha() {
  const [currentUser, setCurrentUser] = useState(() =>
    leerDatosSeguros('yamaha_auth_user_v16', null)
  );

  const [fechaPantalla, setFechaPantalla] = useState(new Date());

  const [operarios, setOperarios] = useState(() =>
    leerDatosSeguros('yamaha_operarios_v16', OP_INICIALES)
  );

  const [bancoPreventivos, setBancoPreventivos] = useState(() =>
    normalizarBanco(
      leerDatosSeguros('yamaha_banco_v16', BANCO_INICIAL)
    )
  );

  const [asignacionesSemanales, setAsignacionesSemanales] = useState(() =>
    leerDatosSeguros('yamaha_semanales_v16')
  );

  const [asignacionesDiarias, setAsignacionesDiarias] = useState(() =>
    leerDatosSeguros('yamaha_diarias_v16')
  );

  const [agendaPorFecha, setAgendaPorFecha] = useState(() =>
    leerDatosSeguros('yamaha_agenda_v16')
  );

  const [notasTareas, setNotasTareas] = useState(() =>
    leerDatosSeguros('yamaha_notas_v16')
  );

  useEffect(() => {
    localStorage.setItem('yamaha_auth_user_v16', JSON.stringify(currentUser));
    localStorage.setItem('yamaha_operarios_v16', JSON.stringify(operarios));
    localStorage.setItem('yamaha_banco_v16', JSON.stringify(bancoPreventivos));
    localStorage.setItem('yamaha_semanales_v16', JSON.stringify(asignacionesSemanales));
    localStorage.setItem('yamaha_diarias_v16', JSON.stringify(asignacionesDiarias));
    localStorage.setItem('yamaha_agenda_v16', JSON.stringify(agendaPorFecha));
    localStorage.setItem('yamaha_notas_v16', JSON.stringify(notasTareas));
  }, [
    currentUser,
    operarios,
    bancoPreventivos,
    asignacionesSemanales,
    asignacionesDiarias,
    agendaPorFecha,
    notasTareas
  ]);

  useEffect(() => {
    const currentYear = fechaPantalla.getFullYear();
    const currentMonth = fechaPantalla.getMonth();

    const strMesActual =
      `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

    setAgendaPorFecha((prevAgenda) => {
      const yaTieneTareasEsteMes = Object.keys(prevAgenda).some((key) =>
        key.startsWith(strMesActual)
      );

      if (yaTieneTareasEsteMes) {
        return prevAgenda;
      }

      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      const strMesPasado =
        `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}`;

      const tareasPrev = Object.keys(prevAgenda).filter((key) =>
        key.startsWith(strMesPasado)
      );

      if (tareasPrev.length === 0) {
        return prevAgenda;
      }

      const nuevaAgenda = { ...prevAgenda };

      let huboClonado = false;
      let diaHabilActual = 0;

      for (let i = 1; i <= 31; i++) {
        const dActual = new Date(
          currentYear,
          currentMonth,
          i
        );

        if (dActual.getMonth() !== currentMonth) {
          break;
        }

        if (
          dActual.getDay() !== 0 &&
          dActual.getDay() !== 6
        ) {
          diaHabilActual++;

          let diaHabilPrev = 0;

          for (let j = 1; j <= 31; j++) {
            const dPrev = new Date(
              prevYear,
              prevMonth,
              j
            );

            if (dPrev.getMonth() !== prevMonth) {
              break;
            }

            if (
              dPrev.getDay() !== 0 &&
              dPrev.getDay() !== 6
            ) {
              diaHabilPrev++;

              if (diaHabilPrev === diaHabilActual) {
                const keyPrev =
                  `${dPrev.getFullYear()}-${String(
                    dPrev.getMonth() + 1
                  ).padStart(2, '0')}-${String(
                    dPrev.getDate()
                  ).padStart(2, '0')}`;

                if (
                  nuevaAgenda[keyPrev] &&
                  nuevaAgenda[keyPrev].length > 0
                ) {
                  const keyActual =
                    `${dActual.getFullYear()}-${String(
                      dActual.getMonth() + 1
                    ).padStart(2, '0')}-${String(
                      dActual.getDate()
                    ).padStart(2, '0')}`;

                  nuevaAgenda[keyActual] =
                    nuevaAgenda[keyPrev].map((tarea) => ({
                      ...tarea,
                      estado: 'Pendiente'
                    }));

                  huboClonado = true;
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
    });
  }, [
    fechaPantalla.getFullYear(),
    fechaPantalla.getMonth()
  ]);

  if (!currentUser) {
    return (
      <LoginView
        onLogin={(user) =>
          setCurrentUser(user)
        }
      />
    );
  }

  const getLunesSemana = (fecha) => {
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

  const getOperarioSemanaMatematico = (fecha) => {
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

    const semanas = Math.floor(
      (
        d.getTime() -
        new Date(2024, 0, 1).getTime()
      ) /
      (
        7 *
        24 *
        60 *
        60 *
        1000
      )
    );

    return operarios[
      ((semanas % operarios.length) + operarios.length) %
        operarios.length
    ];
  };

  const getOperarioPorSemana = (fecha, offset = 0) => {
    const d = new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate() + offset * 7
    );

    return (
      asignacionesSemanales[getLunesSemana(d)] ||
      getOperarioSemanaMatematico(d)
    );
  };

  const pantallaStr =
    `${fechaPantalla.getFullYear()}-${String(
      fechaPantalla.getMonth() + 1
    ).padStart(2, '0')}-${String(
      fechaPantalla.getDate()
    ).padStart(2, '0')}`;

  const operarioDelDia =
    asignacionesDiarias[pantallaStr] ||
    getOperarioPorSemana(fechaPantalla, 0);

  const mesActualStr =
    `${fechaPantalla.getFullYear()}-${String(
      fechaPantalla.getMonth() + 1
    ).padStart(2, '0')}`;

  let tareasMes = 0;
  let completadosMes = 0;

  Object.keys(agendaPorFecha).forEach((key) => {
    if (key.startsWith(mesActualStr)) {
      agendaPorFecha[key].forEach((tarea) => {
        tareasMes++;

        if (tarea.estado === 'Completado') {
          completadosMes++;
        }
      });
    }
  });

  return (
    <div className="yamaha-container">
      <header className="yamaha-header">
        <div className="header-titles">
          <h1>YAMAHA MOTOR ARGENTINA</h1>
          <h2>GESTIÓN INDUSTRIAL</h2>
        </div>

        <div className="header-user-info">
          <div className="user-badge-role">
            👤 <strong>{currentUser.name}</strong>
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
            META DEL MES: {completadosMes} / {tareasMes || 1}
          </span>

          <div className="progress-mini">
            <div
              style={{
                width: `${Math.min(
                  (completadosMes / (tareasMes || 1)) * 100,
                  100
                )}%`
              }}
            />
          </div>
        </div>
      </header>

      {currentUser.role === 'operario' ? (
        <OperarioView
          fechaPantalla={fechaPantalla}
          setFechaPantalla={setFechaPantalla}
          pantallaStr={pantallaStr}
          operarioDelDia={operarioDelDia}
          agendaPorFecha={agendaPorFecha}
          setAgendaPorFecha={setAgendaPorFecha}
          notasTareas={notasTareas}
          setNotasTareas={setNotasTareas}
          bancoPreventivos={bancoPreventivos}
        />
      ) : (
        <SupervisorView
          fechaPantalla={fechaPantalla}
          setFechaPantalla={setFechaPantalla}
          pantallaStr={pantallaStr}
          operarioSemanaAnterior={
            getOperarioPorSemana(fechaPantalla, -1)
          }
          operarioSemanaActual={
            getOperarioPorSemana(fechaPantalla, 0)
          }
          operarioProximaSemana={
            getOperarioPorSemana(fechaPantalla, 1)
          }
          operarioDelDia={operarioDelDia}
          cambiarOperarioSemana={(op) =>
            setAsignacionesSemanales((prev) => ({
              ...prev,
              [getLunesSemana(fechaPantalla)]: op
            }))
          }
          cambiarOperarioDiario={(op) =>
            setAsignacionesDiarias((prev) => ({
              ...prev,
              [pantallaStr]: op
            }))
          }
          agendaPorFecha={agendaPorFecha}
          setAgendaPorFecha={setAgendaPorFecha}
          notasTareas={notasTareas}
          operarios={operarios}
          setOperarios={setOperarios}
          bancoPreventivos={bancoPreventivos}
          setBancoPreventivos={setBancoPreventivos}
          asignacionesDiarias={asignacionesDiarias}
          asignacionesSemanales={asignacionesSemanales}
        />
      )}
    </div>
  );
}