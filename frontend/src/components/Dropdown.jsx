import { useState } from "react";

function Dropdown({ label, options, value, onChange }) {

  const [open, setOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div className="relative w-44">

      <label className="text-sm text-gray-600 mb-1 block">
        {label}
      </label>

      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-white border rounded-lg px-3 py-2 flex justify-between items-center hover:border-gray-400"
      >
        {value}
        <span className="text-gray-500">▾</span>
      </button>

      {open && (
        <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg z-10">

          {options.map((option) => (

            <div
              key={option}
              onClick={() => handleSelect(option)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default Dropdown;