const Button = (props) => {
  const { title, bg, p, text, onClick } = props;
  return (
    <button
      className={`${bg} font-semibold ${p} rounded-2xl ${text}`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default Button;
