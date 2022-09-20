import React, { useState } from 'react';
import './VNSelect.scss';

type OptionProps = {
  value: string
};
function Option({
  value,
}: OptionProps) {
  return <li className="vn-select-option">{value}</li>;
}

type CurrentlySelectedProps = {
  value: string
  onClick: () => void
};
function CurrentlySelected({
  value,
  onClick,
}: CurrentlySelectedProps) {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      className="vn-select-current-option"
      onClick={onClick}
    >
      {value}
    </div>
  );
}

type MenuProps = {
  options: string[]
};
function Menu({
  options,
}: MenuProps) {
  return (
    <ul className="vn-select-menu">
      {options.map((opt) => (
        <Option
          key={opt}
          value={opt}
        />
      ))}
    </ul>
  );
}

/**
 * The select be "one of many options" and a "dropdown menu"
 * Accessible should implemented.
 *
 *
 * WHEN the user clicks / triggers the closed `select`
 * THEN show the dropdown menu of options
 *
 * WHEN the user clicks / triggers the open `select`
 * THEN hide the dropdown menu of options
 * AND the option doesn't change
 *
 * WHEN the user selects an option from the dropdown menu
 * THEN close the dropdown menu
 * AND the `select` should now display the selected option.
 */
export default function VNSelect() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className={`vn-select ${isOpen ? 'vn-select-open' : ''}`}>
      <CurrentlySelected
        value="Selected"
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && <Menu options={['Option1', 'Option2', 'Option3']} />}
    </div>
  );
}
