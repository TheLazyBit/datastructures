import React, { ReactNode, useEffect, useState } from 'react';
import './VNSelect.scss';
import ReactDOM from 'react-dom/client';

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

function getTextWidth(text: string, font: string) {
  // re-use canvas object for better performance
  const self = getTextWidth as { canvas?: HTMLCanvasElement };
  const canvas = (self.canvas || (self.canvas = document.createElement('canvas'))) as HTMLCanvasElement;
  const context = canvas.getContext('2d')!;
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

const selectCounter = 0;
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
  const options = ['opt', 'Option1', 'Option 2', 'Option3'];
  const width = Math.ceil(
    options
      .map((opt) => getTextWidth(opt, '400 16px Segoe UI, serif'))
      .reduce((m, n) => Math.max(m, n), 0),
  );

  return (
    <div
      className={`vn-select ${isOpen ? 'vn-select-open' : ''}`}
      // I don't like this, the margins and border is hardcoded, as well as the font
      // but short of shadow rendering this into the dom, I don't see a better solution
      // to get those values on a first render
      style={{ minWidth: `calc(0.5rem + ${width}px + 2px)` }}
    >
      <CurrentlySelected
        value={options[0]}
        onClick={() => setIsOpen(!isOpen)}
      />
      <Menu options={options} />
    </div>
  );
}
