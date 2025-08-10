
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import './App.css';

/* Componente de Autenticación (login + registro) */
function Auth({ onLogin }) {
  const [users, setUsers] = useLocalStorage('users', [
    { id: 'admin', password: 'admin123', role: 'admin', fullName: 'Administrador' }
  ]);
  const [mode, setMode]    = useState('login'); // 'login' | 'register'
  const [id, setId]        = useState('');
  const [pwd, setPwd]      = useState('');
  const [name, setName]    = useState('');
  const [error, setError]  = useState('');

  const handleLogin = e => {
    e.preventDefault();
    const found = users.find(u => u.id === id && u.password === pwd);
    if (found) {
      onLogin(found);
    } else {
      setError('Credenciales incorrectas');
    }
  };

  const handleRegister = e => {
    e.preventDefault();
    if (!name || !id || !pwd) {
      setError('Llene todos los campos');
      return;
    }
    setUsers([...users, { id, password: pwd, role: 'user', fullName: name }]);
    alert('Usuario registrado');
    setMode('login');
    setError('');
  };

  return (
    <div className="main-content">
      <header>
        <h1 className="emporium-title">EmporiumZ</h1>
      </header>

      {mode === 'login' ? (
        <form className="form-section" onSubmit={handleLogin}>
          <h2>Inicio de sesión</h2>
          <div className="form-group">
            <label>Correo/ID (admin) para ver lista de usuarios</label>
            <input value={id} onChange={e => setId(e.target.value)} required />
          </div>
          <div className="form-group password-container">
            <label>Contraseña (admin123) para ver lista de usuarios</label>
            <input
              type="password"
              value={pwd}
              onChange={e => setPwd(e.target.value)}
              required
            />
            <span className="toggle-password" onClick={() => {
              const inp = document.activeElement;
              if (inp.tagName === 'INPUT') inp.type = inp.type === 'password' ? 'text' : 'password';
            }}>👁</span>
          </div>
          {error && <p className="error">{error}</p>}
          <button className="primary">Ingresar</button>
          <p className="register-link">
            ¿No tienes cuenta?{' '}
            <button type="button" onClick={() => { setMode('register'); setError(''); }}>
              Regístrate aquí para acceder a la seccion de descuentos
            </button>
          </p>
        </form>
      ) : (
        <form className="form-section" onSubmit={handleRegister}>
          <h2>Registro de nuevos usuarios</h2>
          <div className="form-group">
            <label>Nombres y Apellidos</label>
            <input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Correo/ID</label>
            <input value={id} onChange={e => setId(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={pwd}
              onChange={e => setPwd(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button className="primary">Continuar</button>
          <button
            type="button"
            className="btn-back"
            onClick={() => { setMode('login'); setError(''); }}
          >Volver</button>
        </form>
      )}
    </div>
  );
}

/* Panel de Administrador: lista de usuarios con editar/eliminar */
function AdminPanel({ onLogout }) {
  const [users, setUsers] = useLocalStorage('users', []);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ id: '', fullName: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editing) setForm(editing);
  }, [editing]);

  const handleSave = () => {
    if (!form.fullName || !form.password) {
      setError('Complete todos los campos');
      return;
    }
    setUsers(users.map(u => u.id === form.id ? form : u));
    setEditing(null);
    setError('');
  };

  const handleDelete = id =>
    setUsers(users.filter(u => u.id !== id));

  return (
    <div className="main-content">
      <header>
        <h1 className="emporium-title">Admin Panel</h1>
        <button className="btn-back" onClick={onLogout}>Cerrar Sesión</button>
      </header>

      {editing && (
        <div className="form-section">
          <h2>Editar Usuario</h2>
          <div className="form-group">
            <label>ID</label>
            <input value={form.id} disabled />
          </div>
          <div className="form-group">
            <label>Nombre completo</label>
            <input
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button className="primary" onClick={handleSave}>Guardar</button>
          <button className="btn-back" onClick={() => { setEditing(null); setError(''); }}>
            Cancelar
          </button>
        </div>
      )}

      <table className="promo-list">
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Rol</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.fullName}</td>
              <td>{u.role}</td>
              <td>
                <button className="btn-edit" onClick={() => setEditing(u)}>Editar</button>
                <button className="btn-delete" onClick={() => handleDelete(u.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* CRUD de Promociones para usuarios */
function Promotions({ onLogout }) {
  const [promos, setPromos] = useLocalStorage('promotions', []);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    descuento: '', producto: '', fechaInicio: '', fechaFin: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editing) setForm(editing);
  }, [editing]);

  const reset = () => {
    setForm({ descuento: '', producto: '', fechaInicio: '', fechaFin: '' });
    setEditing(null);
    setError('');
  };

  const handleSave = () => {
    const { descuento, producto, fechaInicio, fechaFin } = form;
    if (!descuento || !producto || !fechaInicio || !fechaFin) {
      setError('Complete todos los campos');
      return;
    }
    if (new Date(fechaFin) < new Date(fechaInicio)) {
      setError('Fecha de fin posterior a inicio');
      return;
    }
    if (editing) {
      setPromos(promos.map(p => p.id === form.id ? form : p));
    } else {
      setPromos([...promos, { ...form, id: Date.now().toString() }]);
    }
    reset();
  };

  const handleDelete = id =>
    setPromos(promos.filter(p => p.id !== id));

  const onChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="main-content">
      <header>
        <h1 className="emporium-title">Promociones</h1>
        <button className="btn-back" onClick={onLogout}>Salir</button>
      </header>

      <div className="form-section">
        <h2>{editing ? 'Editar Promoción' : 'Nueva Promoción'}</h2>
        <div className="form-group">
          <label>Descuento (%)</label>
          <input
            type="number" name="descuento" min="0" max="100"
            value={form.descuento} onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label>Producto</label>
          <select name="producto" value={form.producto} onChange={onChange}>
            <option value="">Seleccione</option>
            <option>Producto 1</option>
            <option>Producto 2</option>
            <option>Producto 3</option>
          </select>
        </div>
        <div className="form-group">
          <label>Fecha inicio</label>
          <input type="date" name="fechaInicio" value={form.fechaInicio} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Fecha fin</label>
          <input type="date" name="fechaFin" value={form.fechaFin} onChange={onChange} />
        </div>
        {error && <p className="error">{error}</p>}
        <button className="primary" onClick={handleSave}>
          {editing ? 'Actualizar' : 'Crear Promoción'}
        </button>
        {editing && (
          <button className="btn-back" onClick={reset}>Cancelar</button>
        )}
      </div>

      <table className="promo-list">
        <thead>
          <tr>
            <th>%</th><th>Producto</th><th>Inicio</th><th>Fin</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {promos.map(p => (
            <tr key={p.id}>
              <td>{p.descuento}</td>
              <td>{p.producto}</td>
              <td>{p.fechaInicio}</td>
              <td>{p.fechaFin}</td>
              <td>
                <button className="btn-edit" onClick={() => setEditing(p)}>Editar</button>
                <button className="btn-delete" onClick={() => handleDelete(p.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* Componente principal */
export default function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return user.role === 'admin'
    ? <AdminPanel onLogout={() => setUser(null)} />
    : <Promotions onLogout={() => setUser(null)} />;
}
