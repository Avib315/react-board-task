// Angular equivalent: NavbarComponent
// TODO: implement navigation links (Board, Dashboard, Tasks) and active route highlight

import styles from './Navbar.module.scss';

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <span className={styles.brand}>ProjectHub</span>
      {/* TODO: NavLinks */}
    </nav>
  );
}
