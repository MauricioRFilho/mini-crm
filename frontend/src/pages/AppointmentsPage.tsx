import React, { useState, useEffect } from 'react';
import { getAppointments, createAppointment, advanceAppointmentStatus, deleteAppointment, getPatients } from '../api/client';
import { Appointment, Patient } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { CheckCircle, Play, Trash2, PlusCircle } from 'lucide-react';

export const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [description, setDescription] = useState('');
  const [patientId, setPatientId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (page = currentPage) => {
    try {
      const [apptsResponse, ptsResponse] = await Promise.all([
        getAppointments({ 
          ...(statusFilter ? { status: statusFilter } : {}),
          page,
          limit: 10
        }),
        getPatients(1, 20) // Reduzido de 100 para 20 para melhor LCP
      ]);
      setAppointments(apptsResponse.appointments);
      setTotalPages(apptsResponse.totalPages);
      setPatients(ptsResponse.patients);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
    setCurrentPage(1);
  }, [statusFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return alert('Selecione um paciente');
    try {
      await createAppointment({ description, patientId });
      setDescription('');
      setPatientId('');
      setSearchTerm('');
      fetchData(1);
      setCurrentPage(1);
    } catch (e) {
      alert('Erro ao criar atendimento');
    }
  };

  const handleAdvance = async (id: string) => {
    try {
      await advanceAppointmentStatus(id);
      fetchData();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Erro ao avançar status');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir este atendimento?')) {
      await deleteAppointment(id);
      fetchData();
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchData(newPage);
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Atendimentos</h2>
        <select 
          aria-label="Filtrar por status"
          style={{ width: 'auto', marginBottom: 0 }} 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">Todos os Status</option>
          <option value="AGUARDANDO">Aguardando</option>
          <option value="EM_ATENDIMENTO">Em Atendimento</option>
          <option value="FINALIZADO">Finalizado</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="form-grid" style={{ marginBottom: '2rem' }}>
        <div style={{ position: 'relative' }}>
          <label htmlFor="patient-search">Paciente</label>
          <input 
            id="patient-search"
            type="text"
            placeholder="Selecionar Paciente..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
              if (!e.target.value) setPatientId('');
            }}
            onFocus={() => setShowDropdown(true)}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-expanded={showDropdown}
            aria-controls="patient-listbox"
            required
          />
          {showDropdown && (
            <div className="card" style={{ 
              position: 'absolute', 
              top: '100%', 
              left: 0, 
              right: 0, 
              zIndex: 10, 
              marginTop: '0.5rem',
              padding: '0.5rem',
              maxHeight: '200px',
              overflowY: 'auto',
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              border: '1px solid var(--border)'
            }}
            role="listbox"
            id="patient-listbox"
          >
              {patients
                .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(p => (
                  <div 
                    key={p.id}
                    onClick={() => {
                      setPatientId(p.id);
                      setSearchTerm(p.name);
                      setShowDropdown(false);
                    }}
                    style={{ 
                      padding: '0.75rem', 
                      cursor: 'pointer',
                      borderRadius: '8px',
                      backgroundColor: patientId === p.id ? 'var(--accent)' : 'transparent',
                      transition: 'background 0.2s',
                      color: 'white'
                    }}
                    onMouseEnter={(e) => {
                      if (patientId !== p.id) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      if (patientId !== p.id) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    role="option"
                    aria-selected={patientId === p.id}
                  >
                    {p.name}
                  </div>
                ))
              }
              {patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                <div style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Nenhum paciente encontrado
                </div>
              )}
            </div>
          )}
          {showDropdown && (
            <div 
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9 }} 
              onClick={() => setShowDropdown(false)}
            />
          )}
        </div>
        <div>
          <label htmlFor="appointment-desc">Descrição breve</label>
          <input 
            id="appointment-desc"
            placeholder="Ex: Consulta de rotina" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            required 
          />
        </div>
        <div style={{ alignSelf: 'flex-end' }}>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <PlusCircle size={20} aria-hidden="true" />
            Novo Registro
          </button>
        </div>
      </form>

      {loading ? <p>Carregando...</p> : (
        <>
          <table>
            <thead>
              <tr>
                <th scope="col">Paciente</th>
                <th scope="col">Descrição</th>
                <th scope="col">Status</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? appointments.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 500 }}>{a.patient?.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{a.description}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {a.status !== 'FINALIZADO' && (
                        <button 
                          onClick={() => handleAdvance(a.id)} 
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: 'var(--accent)', 
                            cursor: 'pointer',
                            minWidth: '44px',
                            minHeight: '44px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title={a.status === 'AGUARDANDO' ? 'Iniciar Atendimento' : 'Finalizar Atendimento'}
                          aria-label={a.status === 'AGUARDANDO' ? 'Iniciar Atendimento' : 'Finalizar Atendimento'}
                        >
                          {a.status === 'AGUARDANDO' ? <Play size={18} aria-hidden="true" /> : <CheckCircle size={18} aria-hidden="true" />}
                        </button>
                      )}
                        <button 
                          onClick={() => handleDelete(a.id)} 
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: '#ef4444', 
                            cursor: 'pointer',
                            minWidth: '44px',
                            minHeight: '44px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          aria-label={`Excluir atendimento de ${a.patient?.name}`}
                        >
                          <Trash2 size={18} aria-hidden="true" />
                        </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    Nenhum atendimento encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className="btn-secondary"
              >
                Anterior
              </button>
              <span>Página <strong>{currentPage}</strong> de {totalPages}</span>
              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="btn-secondary"
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
