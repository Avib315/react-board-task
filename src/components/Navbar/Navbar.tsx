import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useTaskStats } from '../../hooks/useTaskStore';
import styles from './Navbar.module.scss';

export function Navbar() {
  const stats = useTaskStats();

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>◆</span>
        <span className={styles.brandName}>ProjectHub</span>
      </div>

      <div className={styles.links}>
        <NavLink
          to="/board"
          className={({ isActive }) => clsx(styles.link, isActive && styles.active)}
        >
          Board
        </NavLink>
      </div>

      <div className={styles.right}>
        <span className={styles.statChip}>
          <span className={clsx(styles.statDot, styles.dotDone)} />
          {stats.done} done
        </span>
        {stats.overdue > 0 && (
          <span className={clsx(styles.statChip, styles.chipOverdue)}>
            <span className={clsx(styles.statDot, styles.dotOverdue)} />
            {stats.overdue} overdue
          </span>
        )}
      </div>
    </nav>
  );
}
