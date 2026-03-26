import React, { useState, useEffect } from 'react';
import { getPatients, createPatient, deletePatient } from '../api/client';
import { Patient } from '../types';
import { Trash2, UserPlus } from 'lucide-react';

export const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const fetchPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPatient({ name, phone, email: email || undefined });
      setName('');
      setPhone('');
      setEmail('');
      fetchPatients();
    } catch (e) {
      alert('Erro ao criar paciente');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir este paciente?')) {
      await deletePatient(id);
      fetchPatients();
    }
  };

  return (
    <div className="card">
      <h2>Gestão de Pacientes</h2>
      
      <form onSubmit={handleSubmit} className="form-grid" style={{ marginBottom: '2rem' }}>
        <input placeholder="Nome Completo" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Telefone" value={phone} onChange={e => setPhone(e.target.value)} required />
        <input placeholder="E-mail (opcional)" value={email} onChange={e => setEmail(e.target.value)} type="email" />
        <button type="submit" className="btn-primary" style={{ height: '45px' }}>
          <UserPlus size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Adicionar
        </button>
      </form>

      {loading ? <p>Carregando...</p> : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Atendimentos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.phone}</td>
                <td style={{ textAlign: 'center' }}>{p._count?.appointments || 0}</td>
                <td>
                  <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
