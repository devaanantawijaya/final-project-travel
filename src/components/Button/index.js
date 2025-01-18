const Button = (props) => {
  const { title, bg, p, text } = props;
  return (
    <button className={`${bg} font-semibold ${p} rounded-2xl ${text}`}>
      {title}
    </button>
  );
};

export default Button;
