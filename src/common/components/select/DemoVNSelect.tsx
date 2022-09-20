import React from 'react';
import './VNSelect.scss';
import VNSelect from './VNSelect';

export default function DemoVNSelect() {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: 'min-content' }}>
        <VNSelect />
      </div>
    </div>
  );
}
