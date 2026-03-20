import './Header.css';

function Header({ title, subtitle }) {
  return (
    <header className="vf-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}

export default Header;
