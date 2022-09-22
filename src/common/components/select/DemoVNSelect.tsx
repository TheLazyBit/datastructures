import React, { useState } from 'react';
import './VNSelect.scss';
import VNSelect from './VNSelect';

const options = ['opt 2', 'Option1', 'Option 2', 'Option3'];
export default function DemoVNSelect() {
  const [selectedOption, setSelectedOption] = useState(0);

  return (
    <div>
      test
      test
      test
      test
      test
      test
      test
      test
      test
      <div style={{ display: 'inline-block', width: 75 }}>
        <VNSelect
          currentlySelected={selectedOption}
          options={options}
          onChange={setSelectedOption}
        />
      </div>
      test
      test
      test
      test
      test
      test
      test
      test
      test
      test
      test
      test
      test
      test
      test
      test
      test
      test
      test
      test
      test
      test
      test
      test
    </div>
  );
}
