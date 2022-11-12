import React, { PropsWithChildren } from 'react';

export default function Center({ children }: PropsWithChildren<{}>) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'
    }}
    >
      {children}
    </div>
  );
}
