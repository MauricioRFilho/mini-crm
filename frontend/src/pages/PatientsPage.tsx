import React, { useState, useEffect } from 'react';
import { getPatients, createPatient, deletePatient } from '../api/client';
import { Patient } from '../types';
import { Trash2, UserPlus } from 'lucide-react';

export const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    let formatted = digits;
    
    if (digits.length > 0) {
      formatted = `(${digits.slice(0, 2)}`;
      if (digits.length > 2) {
        formatted += `) ${digits.slice(2, 7)}`;
        if (digits.length > 7) {
          formatted += `-${digits.slice(7, 11)}`;
        }
      }
    }
    return formatted.slice(0, 15);
  };

  const fetchPatients = async (currentPage: number) => {
    setLoading(true);
    try {
      const { patients: data, totalPages: total } = await getPatients(currentPage, 10);
      setPatients(data);
      setTotalPages(total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(page);
  }, [page]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }
    
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 11) {
      newErrors.phone = 'Telefone deve ter 11 dígitos (DDD + número)';
    }
    
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'E-mail inválido';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      await createPatient({ name, phone: phone.replace(/\D/g, ''), email: email || undefined });
      setName('');
      setPhone('');
      setEmail('');
      setErrors({});
      setPage(1);
      fetchPatients(1);
    } catch (e) {
      alert('Erro ao criar paciente. Verifique se o e-mail ou telefone já estão cadastrados.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir este paciente?')) {
      await deletePatient(id);
      fetchPatients(page);
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Gestão de Pacientes</h2>
      </div>
      
      <div className="form-card">
        <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.1rem' }}>Novo Paciente</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="patient-name">Nome Completo</label>
              <input 
                id="patient-name"
                placeholder="Ex: João Silva" 
                value={name} 
                onChange={e => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }} 
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="patient-phone">Telefone</label>
              <input 
                id="patient-phone"
                placeholder="(00) 00000-0000" 
                value={phone} 
                onChange={e => {
                  setPhone(formatPhone(e.target.value));
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }} 
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="patient-email">E-mail</label>
              <input 
                id="patient-email"
                placeholder="email@exemplo.com" 
                value={email} 
                onChange={e => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }} 
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.85rem 1.5rem' }}>
              <UserPlus size={18} aria-hidden="true" />
              Adicionar Paciente
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Carregando pacientes...</p>
        </div>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Telefone</th>
                <th scope="col" style={{ textAlign: 'center' }}>Atendimentos</th>
                <th scope="col" style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    Nenhum paciente encontrado.
                  </td>
                </tr>
              ) : (
                patients.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{formatPhone(p.phone)}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="status-badge status-em_atendimento" style={{ fontSize: '0.65rem' }}>
                        {p._count?.appointments || 0}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDelete(p.id)} 
                        className="btn-delete"
                        aria-label={`Excluir paciente ${p.name}`}
                        style={{ 
                          background: 'rgba(239, 68, 68, 0.1)', 
                          border: 'none', 
                          color: '#ef4444', 
                          cursor: 'pointer', 
                          padding: '8px', 
                          borderRadius: '8px', 
                          transition: 'all 0.2s',
                          minWidth: '44px',
                          minHeight: '44px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Trash2 size={18} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="btn-secondary" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </button>
              <span>
                Página <strong>{page}</strong> de {totalPages}
              </span>
              <button 
                className="btn-secondary" 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
