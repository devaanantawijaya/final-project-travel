const Button = (props) => {
  const { title, bg } = props;
  return (
    <button className={`${bg} font-semibold px-7 py-1 rounded-2xl`}>
      {title}
    </button>
  );
};

export default Button;
