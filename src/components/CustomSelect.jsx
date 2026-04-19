// This component is a custom dropdown (select) with styled UI and controlled state

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CustomSelect({ value, onChange, options, className = '' }) {
  // State to control dropdown open/close
  const [isOpen, setIsOpen] = useState(false);

  // Ref to detect clicks outside component
  const ref = useRef(null);

  // Handle closing dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Find selected option or fallback to first option
  const selectedOption = options.find(o => o.value === value) || options[0];

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)} // Toggle dropdown
        className="w-full flex items-center justify-between bg-slate-900/50 backdrop-blur border border-slate-700/80 hover:border-slate-500 text-sm rounded-xl py-2.5 pl-4 pr-3 text-slate-300 transition-all shadow-sm font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
      >
        {selectedOption.label} {/* Selected value */}
        
        {/* Dropdown arrow */}
        <ChevronDown
          size={18}
          className={`text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        // Dropdown menu container
        <div className="absolute top-full mt-2 w-full bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Scrollable options list */}
          <div className="max-h-60 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value); // Update selected value
                  setIsOpen(false);    // Close dropdown
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors tracking-wide ${
                  value === opt.value
                    ? 'bg-cyan-500/10 text-cyan-400 font-bold border-l-2 border-cyan-400'
                    : 'text-slate-400 font-medium hover:bg-slate-800 hover:text-slate-200 border-l-2 border-transparent'
                }`}
              >
                {opt.label} {/* Option label */}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}