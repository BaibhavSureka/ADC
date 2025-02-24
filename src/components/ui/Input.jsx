const Input = ({ type = "text", className = "", ...props }) => {
  return (
    <input
      type={type}
      className={`p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
};

export default Input;
