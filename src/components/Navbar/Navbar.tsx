import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useTaskStats } from '../../hooks/useTaskStore';
import styles from './Navbar.module.scss';

const ANGULAR_BASE = 'http://localhost:4200';

export function Navbar() {
  const stats = useTaskStats();

  return (
    <nav className={styles.navbar}>
      {/* Brand */}
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

        {/* Dashboard — Angular page */}
        <a href={`${ANGULAR_BASE}/dashboard`} className={clsx(styles.link, styles.external)} title="Opens in Angular app (localhost:4200)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3"  y="3"  width="7" height="7"/>
            <rect x="14" y="3"  width="7" height="7"/>
            <rect x="3"  y="14" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
          </svg>
          Dashboard
          <svg className={styles.externalIcon} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>

        {/* Board — React page (active route) */}
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

        {/* Tasks — Angular page */}
        <a href={`${ANGULAR_BASE}/tasks`} className={clsx(styles.link, styles.external)} title="Opens in Angular app (localhost:4200)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8"    y1="6"  x2="21"   y2="6"/>
            <line x1="8"    y1="12" x2="21"   y2="12"/>
            <line x1="8"    y1="18" x2="21"   y2="18"/>
            <line x1="3"    y1="6"  x2="3.01" y2="6"/>
            <line x1="3"    y1="12" x2="3.01" y2="12"/>
            <line x1="3"    y1="18" x2="3.01" y2="18"/>
          </svg>
          Tasks
          <svg className={styles.externalIcon} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>

      </div>

      {/* Stat chips */}
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
