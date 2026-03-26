import React, { useState } from 'react';
import { PatientsPage } from './pages/PatientsPage';
import { AppointmentsPage } from './pages/AppointmentsPage';

function App() {
  const [activeTab, setActiveTab] = useState<'patients' | 'appointments'>('appointments');

  return (
    <div className="layout">
      <header>
        <h1 style={{ marginBottom: '0.5rem', color: 'white' }}>Mini CRM Clinic</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Sistema de Gestão de Atendimentos</p>
      </header>

      <nav>
        <button 
          className={activeTab === 'appointments' ? 'active' : ''} 
          onClick={() => setActiveTab('appointments')}
        >
          Atendimentos
        </button>
        <button 
          className={activeTab === 'patients' ? 'active' : ''} 
          onClick={() => setActiveTab('patients')}
        >
          Pacientes
        </button>
      </nav>

      <main>
        {activeTab === 'patients' ? <PatientsPage /> : <AppointmentsPage />}
      </main>
    </div>
  );
}

export default App;
