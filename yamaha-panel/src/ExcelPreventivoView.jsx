import React, {
  useEffect,
  useMemo,
  useState
} from 'react';

import * as XLSX from 'xlsx';

const obtenerHojasRelacionadas = (
  nombresHojas,
  idExcel
) => {
  const id = String(idExcel);

  let hojas =
    nombresHojas.filter(
      (nombre) => {
        const limpio =
          nombre.trim();

        return (
          limpio === id ||
          limpio.startsWith(
            `${id} (`
          ) ||
          limpio.startsWith(
            `${id}+`
          ) ||
          limpio.startsWith(
            `${id}-`
          ) ||
          limpio.startsWith(
            `${id} -`
          ) ||
          limpio.startsWith(
            `${id} `
          )
        );
      }
    );

  /*
    El ID 66 es "Apilador
    hidráulico Manual (Cantidad 3)"

    Dentro del Excel tiene
    las hojas 66 y 67
    correspondientes a
    apiladores hidráulicos.
  */

  if (
    Number(idExcel) === 66 &&
    nombresHojas.includes('67')
  ) {
    hojas.push('67');
  }

  return [
    ...new Set(hojas)
  ];
};

export default function ExcelPreventivoView({
  idExcel,
  nombreEquipo
}) {
  const [
    workbook,
    setWorkbook
  ] = useState(null);

  const [
    hojaActiva,
    setHojaActiva
  ] = useState('');

  const [
    error,
    setError
  ] = useState('');

  useEffect(() => {
    let activo = true;

    const cargarExcel =
      async () => {
        try {
          setError('');

          const response =
            await fetch(
              '/planillas.xlsx'
            );

          if (
            !response.ok
          ) {
            throw new Error(
              'No se encontró public/planillas.xlsx'
            );
          }

          const data =
            await response.arrayBuffer();

          const libro =
            XLSX.read(data, {
              type: 'array',

              cellDates:
                true
            });

          if (!activo) {
            return;
          }

          const hojas =
            obtenerHojasRelacionadas(
              libro.SheetNames,
              idExcel
            );

          setWorkbook(libro);

          if (
            hojas.length ===
            0
          ) {
            setError(
              `El preventivo "${nombreEquipo}" tiene asignado el ID ${idExcel}, pero el archivo planillas.xlsx no contiene una hoja para ese ID.`
            );

            return;
          }

          setHojaActiva(
            hojas[0]
          );
        } catch (err) {
          console.error(
            err
          );

          if (activo) {
            setError(
              'No se pudo cargar public/planillas.xlsx. Revisá que el archivo se llame exactamente planillas.xlsx.'
            );
          }
        }
      };

    cargarExcel();

    return () => {
      activo = false;
    };
  }, [
    idExcel,
    nombreEquipo
  ]);

  const hojasDisponibles =
    useMemo(() => {
      if (!workbook) {
        return [];
      }

      return obtenerHojasRelacionadas(
        workbook.SheetNames,
        idExcel
      );
    }, [
      workbook,
      idExcel
    ]);

  const htmlPlanilla =
    useMemo(() => {
      if (
        !workbook ||
        !hojaActiva
      ) {
        return '';
      }

      const worksheet =
        workbook.Sheets[
          hojaActiva
        ];

      if (!worksheet) {
        return '';
      }

      return XLSX.utils.sheet_to_html(
        worksheet,
        {
          id: 'tabla-preventivo'
        }
      );
    }, [
      workbook,
      hojaActiva
    ]);

  const volverAlSistema =
    () => {
      const url =
        new URL(
          window.location.href
        );

      url.searchParams.delete(
        'preventivoExcel'
      );

      url.searchParams.delete(
        'equipo'
      );

      window.location.href =
        `${url.pathname}`;
    };

  return (
    <div
      style={{
        minHeight:
          '100vh',

        background:
          '#F3F4F6',

        padding:
          '24px',

        boxSizing:
          'border-box'
      }}
    >
      <style>
        {`
          .excel-preventivo-contenido table {
            border-collapse: collapse;
            width: max-content;
            min-width: 100%;
            background: white;
            font-family: Arial, sans-serif;
            font-size: 13px;
          }

          .excel-preventivo-contenido td,
          .excel-preventivo-contenido th {
            border: 1px solid #cbd5e1;
            padding: 6px 8px;
            min-width: 80px;
            white-space: pre-wrap;
            vertical-align: middle;
          }

          .excel-preventivo-contenido tr:first-child td {
            font-weight: 700;
          }
        `}
      </style>

      <div
        style={{
          maxWidth:
            '1600px',

          margin:
            '0 auto'
        }}
      >
        <div
          style={{
            background:
              'white',

            borderRadius:
              '12px',

            padding:
              '20px',

            marginBottom:
              '20px',

            border:
              '1px solid #E5E7EB',

            boxShadow:
              '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          <div
            style={{
              display:
                'flex',

              justifyContent:
                'space-between',

              alignItems:
                'center',

              flexWrap:
                'wrap',

              gap: '16px'
            }}
          >
            <div>
              <div
                style={{
                  fontSize:
                    '0.75rem',

                  fontWeight:
                    '700',

                  color:
                    '#D71920',

                  textTransform:
                    'uppercase',

                  letterSpacing:
                    '0.05em',

                  marginBottom:
                    '5px'
                }}
              >
                Yamaha Motor
                Argentina
              </div>

              <h1
                style={{
                  margin:
                    '0 0 6px 0',

                  fontSize:
                    '1.5rem',

                  color:
                    '#111827'
                }}
              >
                Preventivo
              </h1>

              <div
                style={{
                  fontWeight:
                    '700',

                  color:
                    '#374151'
                }}
              >
                {
                  nombreEquipo
                }
              </div>

              <div
                style={{
                  marginTop:
                    '5px',

                  color:
                    '#9CA3AF',

                  fontSize:
                    '0.8rem'
                }}
              >
                ID del
                preventivo:{' '}
                {idExcel}
              </div>
            </div>

            <div
              style={{
                display:
                  'flex',

                gap: '10px',

                flexWrap:
                  'wrap'
              }}
            >
              <button
                type="button"
                onClick={
                  volverAlSistema
                }
                style={{
                  padding:
                    '10px 16px',

                  border:
                    '1px solid #D1D5DB',

                  background:
                    'white',

                  borderRadius:
                    '7px',

                  cursor:
                    'pointer',

                  fontWeight:
                    '700',

                  color:
                    '#374151'
                }}
              >
                ← Volver
              </button>

              <a
                href="/planillas.xlsx"
                target="_blank"
                rel="noreferrer"
                style={{
                  padding:
                    '10px 16px',

                  background:
                    '#10B981',

                  color:
                    'white',

                  borderRadius:
                    '7px',

                  textDecoration:
                    'none',

                  fontWeight:
                    '700'
                }}
              >
                📊 Abrir Excel
                completo
              </a>
            </div>
          </div>

          {hojasDisponibles.length >
            1 && (
            <div
              style={{
                display:
                  'flex',

                gap: '8px',

                flexWrap:
                  'wrap',

                marginTop:
                  '20px',

                paddingTop:
                  '20px',

                borderTop:
                  '1px solid #E5E7EB'
              }}
            >
              <span
                style={{
                  display:
                    'flex',

                  alignItems:
                    'center',

                  fontWeight:
                    '700',

                  fontSize:
                    '0.85rem',

                  color:
                    '#6B7280',

                  marginRight:
                    '5px'
                }}
              >
                Planillas:
              </span>

              {hojasDisponibles.map(
                (hoja) => (
                  <button
                    key={hoja}
                    type="button"
                    onClick={() =>
                      setHojaActiva(
                        hoja
                      )
                    }
                    style={{
                      padding:
                        '8px 13px',

                      borderRadius:
                        '6px',

                      border:
                        hojaActiva ===
                        hoja
                          ? '2px solid #D71920'
                          : '1px solid #D1D5DB',

                      background:
                        hojaActiva ===
                        hoja
                          ? '#FEF2F2'
                          : 'white',

                      color:
                        hojaActiva ===
                        hoja
                          ? '#B91C1C'
                          : '#374151',

                      cursor:
                        'pointer',

                      fontWeight:
                        '700'
                    }}
                  >
                    Hoja {hoja}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {error ? (
          <div
            style={{
              background:
                '#FEF2F2',

              border:
                '1px solid #FCA5A5',

              color:
                '#991B1B',

              padding:
                '20px',

              borderRadius:
                '10px',

              fontWeight:
                '600'
            }}
          >
            ⚠️ {error}
          </div>
        ) : !workbook ||
          !hojaActiva ? (
          <div
            style={{
              background:
                'white',

              padding:
                '30px',

              borderRadius:
                '10px',

              border:
                '1px solid #E5E7EB',

              textAlign:
                'center',

              color:
                '#6B7280'
            }}
          >
            Cargando
            preventivo...
          </div>
        ) : (
          <div
            className="excel-preventivo-contenido"
            style={{
              background:
                'white',

              overflow:
                'auto',

              padding:
                '20px',

              borderRadius:
                '12px',

              border:
                '1px solid #E5E7EB',

              boxShadow:
                '0 2px 8px rgba(0,0,0,0.05)'
            }}
            dangerouslySetInnerHTML={{
              __html:
                htmlPlanilla
            }}
          />
        )}
      </div>
    </div>
  );
}