import "./Header.css";
import hikki from '../../assets/images/mini_hiki_comendo.png'
function Header() {
  return (
    <>
      <header>
        <ul>
          <li className="imgHeader">
            <img
              src= {hikki}
              alt="hikki"
            />
          </li>
          <li>
            <a href="/">API Países  </a>
          </li>
        </ul>
      </header>
    </>
  );
}

export default Header;
