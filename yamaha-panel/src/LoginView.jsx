import React, { useState } from 'react';

export default function LoginView({ onLogin }) {
  const [tipoRol, setTipoRol] = useState('operario');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (tipoRol === 'supervisor') {
      if (password === '1234') {
        onLogin({
          role: 'supervisor',
          name: 'Supervisión General'
        });
      } else {
        setError('Contraseña de supervisor incorrecta.');
      }

      return;
    }

    onLogin({
      role: 'operario',
      name: 'Equipo Operativo Yamaha'
    });
  };

  const cambiarRol = (rol) => {
    setTipoRol(rol);
    setPassword('');
    setError('');
    setMostrarPassword(false);
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <div className="login-header">
          <h1>YAMAHA MOTOR</h1>
          <p>Sistema Integral de Mantenimiento</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="login-form"
        >

          <div className="rol-tabs">

            <button
              type="button"
              className={`tab-btn ${
                tipoRol === 'operario' ? 'active' : ''
              }`}
              onClick={() => cambiarRol('operario')}
            >
              🛠️ Operario
            </button>

            <button
              type="button"
              className={`tab-btn ${
                tipoRol === 'supervisor' ? 'active' : ''
              }`}
              onClick={() => cambiarRol('supervisor')}
            >
              📊 Supervisor
            </button>

          </div>

          {tipoRol === 'supervisor' && (
            <div className="form-group">

              <label>
                Contraseña de supervisor
              </label>

              <div className="password-field">

                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="login-input password-input"
                  placeholder="Ingresar contraseña"
                  autoFocus
                />

                <button
                  type="button"
                  className="password-eye"
                  onClick={() =>
                    setMostrarPassword(!mostrarPassword)
                  }
                  aria-label={
                    mostrarPassword
                      ? 'Ocultar contraseña'
                      : 'Mostrar contraseña'
                  }
                >

                  {mostrarPassword ? (
                    /* OJO TACHADO */
                    <svg
                      viewBox="0 0 24 24"
                      width="21"
                      height="21"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                      <path d="M9.9 4.2A10.5 10.5 0 0112 4c5 0 9 4 10 8a12.7 12.7 0 01-2 4.1" />
                      <path d="M6.6 6.6C4.5 8 3.2 10 2 12c1 4 5 8 10 8a10.8 10.8 0 004.1-.8" />
                    </svg>
                  ) : (
                    /* OJO */
                    <svg
                      viewBox="0 0 24 24"
                      width="21"
                      height="21"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}

                </button>

              </div>

            </div>
          )}

          {tipoRol === 'operario' && (
            <div className="login-operario-info">
              Acceso directo al panel operativo
            </div>
          )}

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-login-submit"
          >
            Ingresar al Sistema ➔
          </button>

        </form>

      </div>

    </div>
  );
}