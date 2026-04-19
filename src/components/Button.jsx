// This component is a reusable button used across the app with different styles (variants)

export default function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false
}) {
  // Base styling applied to all buttons
  const baseStyle =
    "px-4 py-2 rounded-md font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  // Different button style variants
  const variants = {
    primary: "bg-cyan-500 hover:bg-cyan-600 text-white",
    secondary: "bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white",
    "ghost-danger": "bg-transparent hover:bg-red-500/10 text-red-500 hover:text-red-400"
  };

  return (
    <button
      type={type}          // Button type (button, submit, etc.)
      onClick={onClick}    // Click handler
      disabled={disabled}  // Disabled state
      className={`${baseStyle} ${variants[variant]} ${className}`} // Combined styles
    >
      {children} {/* Button content */}
    </button>
  );
}