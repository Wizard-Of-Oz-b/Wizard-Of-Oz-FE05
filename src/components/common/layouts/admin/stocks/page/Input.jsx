export default function Input({ className = '', ...rest }) {
  return (
    <input
      {...rest}
      className={
        'h-10 rounded-xl bg-gray-50 px-3 text-sm outline-none border-0 shadow-sm ' +
        className
      }
    />
  );
}
