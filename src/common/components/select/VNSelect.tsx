import React, { useState } from 'react';
import './VNSelect.scss';

type OptionProps = {
  value: string,
  onActivation: () => void,
};
function Option({
  value,
  onActivation,
}: OptionProps) {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
    <li
      className="vn-select-option"
      onClick={onActivation}
    >
      {value}
    </li>
  );
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
  onChange: (idx: number) => void
};
function Menu({
  options,
  onChange,
}: MenuProps) {
  return (
    <ul className="vn-select-menu">
      {options.map((opt, idx) => (
        <Option
          key={opt}
          value={opt}
          onActivation={() => onChange(idx)}
        />
      ))}
    </ul>
  );
}

function getTextWidth(text: string, font: string) {
  // re-use canvas object for better performance
  const self = getTextWidth as { canvas?: HTMLCanvasElement };
  const canvas = (self.canvas || (self.canvas = document.createElement('canvas'))) as HTMLCanvasElement;
  const context = canvas.getContext('2d')!;
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

export type VNSelectProps = {
  currentlySelected: number
  options: string[]
  onChange: (idx: number) => void
};
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
export default function VNSelect({
  currentlySelected,
  options,
  onChange,
}: VNSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  if (currentlySelected < 0) throw new Error(`The provided currently selected idx '${currentlySelected}' is smaller 0!`);
  if (currentlySelected >= options.length) {
    throw new Error(`The provided currently selected idx '${currentlySelected}'`
    + ` is out of range for the number of options provided '${options.length}'`);
  }

  return (
    <div
      className={`vn-select ${isOpen ? 'vn-select-open' : ''}`}
    >
      <CurrentlySelected
        value={options[currentlySelected]}
        onClick={() => setIsOpen(!isOpen)}
      />
      <Menu
        options={options}
        onChange={(idx) => {
          if (currentlySelected !== idx) onChange(idx);
        }}
      />
    </div>
  );
}
