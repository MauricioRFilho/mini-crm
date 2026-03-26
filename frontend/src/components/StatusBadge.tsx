import React from 'react';
import { AppointmentStatus } from '../types';

interface Props {
  status: AppointmentStatus;
}

const colorMap = {
  AGUARDANDO: '#f59e0b', // Yellow
  EM_ATENDIMENTO: '#3b82f6', // Blue
  FINALIZADO: '#10b981', // Green
};

export const StatusBadge: React.FC<Props> = ({ status }) => {
  return (
    <span className={`status-badge status-${status.toLowerCase()}`}>
      {status.replace('_', ' ')}
    </span>
  );
};
