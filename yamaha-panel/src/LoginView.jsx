import React, { useState } from 'react';

export default function LoginView({ onLogin }) {
  const [tipoRol, setTipoRol] = useState('operario');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    setError('');

    // SUPERVISOR
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

    // OPERARIO
    if (tipoRol === 'operario') {
      onLogin({
        role: 'operario',
        name: 'Equipo Operativo Yamaha'
      });
    }
  };

  const cambiarRol = (rol) => {
    setTipoRol(rol);
    setPassword('');
    setError('');
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
                tipoRol === 'operario'
                  ? 'active'
                  : ''
              }`}
              onClick={() => cambiarRol('operario')}
            >
              🛠️ Operario
            </button>

            <button
              type="button"
              className={`tab-btn ${
                tipoRol === 'supervisor'
                  ? 'active'
                  : ''
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

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="login-input"
                placeholder="Ingresar contraseña"
                autoFocus
              />

            </div>
          )}

          {tipoRol === 'operario' && (
            <div
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.82rem',
                textAlign: 'center'
              }}
            >
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