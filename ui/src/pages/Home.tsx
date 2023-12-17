import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <h2>Welcome to Library App</h2>
      Check out our <Link to="/books">books</Link>
    </>
  );
};

export default Home;
