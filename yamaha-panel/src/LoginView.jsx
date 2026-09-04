import React, { useState } from 'react';

export default function LoginView({ onLogin }) {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    // Pasa el usuario ingresado al dashboard principal
    onLogin({ name: nombre.trim(), role: nombre.toLowerCase().includes('sup') ? 'supervisor' : 'operario' });
  };

  return (
    <div className="yamaha-login-container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#111'}}>
      <form onSubmit={handleSubmit} className="login-card" style={{background: '#222', padding: '30px', borderRadius: '8px', width: '350px', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.5)'}}>
        <h2 style={{textAlign: 'center', marginBottom: '20px', color: 'var(--y-red, #E60012)'}}>YAMAHA MOTOR</h2>
        
        {/* Campo de Usuario */}
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Usuario / Nombre:</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            placeholder="Ingrese su nombre..." 
            required
            style={{width: '100%', padding: '10px', background: '#333', border: '1px solid #441', color: '#fff', borderRadius: '4px'}}
          />
        </div>

        {/* Campo de Contraseña / Credencial con Contador y Ojito */}
        <div style={{marginBottom: '20px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem'}}>
            <label>Contraseña / PIN:</label>
            <span style={{color: '#888', fontSize: '0.8rem'}}>{password.length} caracteres</span>
          </div>
          <div style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
            <input 
              type={mostrarPassword ? 'text' : 'password'} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Ingrese clave..." 
              style={{width: '100%', padding: '10px', paddingRight: '40px', background: '#333', border: '1px solid #441', color: '#fff', borderRadius: '4px'}}
            />
            <button 
              type="button" 
              onClick={() => setMostrarPassword(!mostrarPassword)} 
              style={{position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem'}}
              title={mostrarPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
            >
              {mostrarPassword ? '👁️' : '🔒'}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          style={{width: '100%', padding: '12px', background: 'var(--y-red, #E60012)', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'}}
        >
          Ingresar al Sistema
        </button>
      </form>
    </div>
  );
}