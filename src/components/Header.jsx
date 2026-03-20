import './Header.css';

function Header({ title, subtitle }) {
  return (
    <header className="vf-header">
      <div className="vf-header__nav">
        <div className="vf-header__brand">
          <div className="vf-header__logo-shell">
            <img src="/vision_logo.png" alt="Logo VisionFolder" className="vf-header__logo" />
          </div>

          <div className="vf-header__copy">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
