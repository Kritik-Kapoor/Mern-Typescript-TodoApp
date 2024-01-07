const randomId = () => {
  return (Math.floor(Math.random() * 1000000000) + 1).toString();
};

export default randomId;
