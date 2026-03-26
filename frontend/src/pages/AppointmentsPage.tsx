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
  const [statusFilter, setStatusFilter] = useState('');

  const fetchData = async () => {
    try {
      const [appts, pts] = await Promise.all([
        getAppointments(statusFilter ? { status: statusFilter } : {}),
        getPatients()
      ]);
      setAppointments(appts);
      setPatients(pts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return alert('Selecione um paciente');
    try {
      await createAppointment({ description, patientId });
      setDescription('');
      setPatientId('');
      fetchData();
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

  return (
    <div className="card">
      <h2>Atendimentos</h2>

      <form onSubmit={handleSubmit} className="form-grid" style={{ marginBottom: '2rem' }}>
        <select value={patientId} onChange={e => setPatientId(e.target.value)} required>
          <option value="">Selecionar Paciente...</option>
          {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input placeholder="Descrição do Atendimento" value={description} onChange={e => setDescription(e.target.value)} required />
        <button type="submit" className="btn-primary" style={{ height: '45px' }}>
          <PlusCircle size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Novo Registro
        </button>
      </form>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <select 
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

      {loading ? <p>Carregando...</p> : (
        <table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Descrição</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a.id}>
                <td style={{ fontWeight: 500 }}>{a.patient?.name}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{a.description}</td>
                <td><StatusBadge status={a.status} /></td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {a.status !== 'FINALIZADO' && (
                      <button 
                        onClick={() => handleAdvance(a.id)} 
                        style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}
                        title={a.status === 'AGUARDANDO' ? 'Iniciar Atendimento' : 'Finalizar Atendimento'}
                      >
                        {a.status === 'AGUARDANDO' ? <Play size={18} /> : <CheckCircle size={18} />}
                      </button>
                    )}
                    <button onClick={() => handleDelete(a.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
