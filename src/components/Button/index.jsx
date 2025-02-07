const Button = (props) => {
  const { title, bg, p, text, onClick, disabled } = props;
  return (
    <button
      className={`${bg} font-semibold ${p} rounded-2xl ${text}`}
      onClick={onClick}
      disabled={disabled}
    >
      {title}
    </button>
  );
};

export default Button;
