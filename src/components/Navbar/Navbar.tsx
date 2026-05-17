import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useTaskStats } from '../../hooks/useTaskStore';
import styles from './Navbar.module.scss';

export function Navbar() {
  const stats = useTaskStats();

  return (
    <nav className={styles.navbar}>
      {/* Brand — exact Angular SVG logo */}
      <div className={styles.brand}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3"  y="3"  width="7" height="7" rx="1" fill="currentColor" opacity="0.9"/>
          <rect x="14" y="3"  width="7" height="7" rx="1" fill="currentColor" opacity="0.6"/>
          <rect x="3"  y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.6"/>
          <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.3"/>
        </svg>
        <span className={styles.brandName}>ProjectHub</span>
      </div>

      {/* Nav links */}
      <div className={styles.links}>
        <NavLink
          to="/board"
          className={({ isActive }) => clsx(styles.link, isActive && styles.active)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3"  y="3" width="5" height="18" rx="1"/>
            <rect x="10" y="3" width="5" height="12" rx="1"/>
            <rect x="17" y="3" width="5" height="15" rx="1"/>
          </svg>
          Board
          {stats.inProgress > 0 && (
            <span className={styles.badge}>{stats.inProgress}</span>
          )}
        </NavLink>
      </div>

      {/* Stat chips — mirrors Angular navbar-right */}
      <div className={styles.right}>
        <span className={styles.statChip}>
          <span className={clsx(styles.statDot, styles.dotDone)} />
          {stats.completionRate}% done
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
