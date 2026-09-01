import React, { useState } from 'react';

export default function LoginView({ onLogin }) {
  const [tipoRol, setTipoRol] = useState('operario');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (tipoRol === 'supervisor' && (password === 'admin123' || password === '')) {
      onLogin({ role: 'supervisor', name: 'Supervisión General' });
    } else if (tipoRol === 'operario' && (password === 'planta123' || password === '')) {
      onLogin({ role: 'operario', name: 'Equipo Operativo Yamaha' });
    } else {
      setError('Credenciales incorrectas.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>YAMAHA MOTOR</h1>
          <p>Sistema Integral de Mantenimiento</p>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <div className="rol-tabs">
            <button type="button" className={`tab-btn ${tipoRol === 'operario' ? 'active' : ''}`} onClick={() => setTipoRol('operario')}>🛠️ Operario</button>
            <button type="button" className={`tab-btn ${tipoRol === 'supervisor' ? 'active' : ''}`} onClick={() => setTipoRol('supervisor')}>📊 Supervisor</button>
          </div>
          <div className="form-group">
            <label>Contraseña de Acceso:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="login-input" />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="btn-login-submit">Ingresar al Sistema ➔</button>
        </form>
      </div>
    </div>
  );
}