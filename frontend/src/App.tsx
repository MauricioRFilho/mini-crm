import React, { useState, useEffect, Suspense } from 'react';
import { Sun, Moon, Loader2 } from 'lucide-react';

const PatientsPage = React.lazy(() => import('./pages/PatientsPage').then(module => ({ default: module.PatientsPage })));
const AppointmentsPage = React.lazy(() => import('./pages/AppointmentsPage').then(module => ({ default: module.AppointmentsPage })));

function App() {
  const [activeTab, setActiveTab] = useState<'patients' | 'appointments'>('appointments');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => 
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const LoadingFallback = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
      <Loader2 className="animate-spin" size={32} />
    </div>
  );

  return (
    <div className="layout">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Mini CRM Clinic</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Sistema de Gestão de Atendimentos</p>
        </div>
        <button 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="card"
          aria-label={theme === 'light' ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
          style={{ 
            padding: '0.6rem',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            border: '1px solid var(--border)',
            background: 'var(--card-bg)',
            color: 'var(--text-primary)',
            marginTop: '0.5rem',
            minWidth: '44px',
            minHeight: '44px'
          }}
          title={theme === 'light' ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
        >
          {theme === 'light' ? <Moon size={20} aria-hidden="true" /> : <Sun size={20} aria-hidden="true" />}
        </button>
      </header>

      <nav role="tablist" aria-label="Navegação Principal">
        <button 
          id="tab-appointments"
          role="tab"
          aria-selected={activeTab === 'appointments'}
          aria-controls="appointments-panel"
          className={activeTab === 'appointments' ? 'active' : ''} 
          onClick={() => setActiveTab('appointments')}
        >
          Atendimentos
        </button>
        <button 
          id="tab-patients"
          role="tab"
          aria-selected={activeTab === 'patients'}
          aria-controls="patients-panel"
          className={activeTab === 'patients' ? 'active' : ''} 
          onClick={() => setActiveTab('patients')}
        >
          Pacientes
        </button>
      </nav>

      <main>
        <Suspense fallback={<LoadingFallback />}>
          {activeTab === 'appointments' ? (
            <div id="appointments-panel" role="tabpanel" aria-labelledby="tab-appointments">
              <AppointmentsPage />
            </div>
          ) : (
            <div id="patients-panel" role="tabpanel" aria-labelledby="tab-patients">
              <PatientsPage />
            </div>
          )}
        </Suspense>
      </main>
    </div>
  );
}

export default App;
