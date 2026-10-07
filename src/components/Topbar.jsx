import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/dashboard':     { title: 'Dashboard',            sub: 'Overview of website content' },
  '/announcements': { title: 'Announcements',         sub: 'Manage public announcements' },
  '/programmes':    { title: 'Programmes',            sub: 'Manage union events & programmes' },
  '/excom':         { title: 'Executive Committee',   sub: 'Manage ExCom members' },
  '/gallery':       { title: 'Gallery',               sub: 'Manage photo gallery' },
  '/complaints':    { title: 'Complaints',            sub: 'View & respond to student complaints' },
};

export default function Topbar() {
  const { pathname } = useLocation();
  const basePath = '/' + pathname.split('/')[1];
  const page = pageTitles[basePath] || { title: 'Admin Panel', sub: '' };

  return (
    <header className="topbar">
      <div>
        <div className="topbar-title">{page.title}</div>
        {page.sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1px' }}>{page.sub}</div>}
      </div>
      <div className="topbar-right">
        <span className="topbar-badge">🟢 Live</span>
      </div>
    </header>
  );
}