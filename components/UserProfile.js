import { useAuth } from '../hooks/useAuth';

export default function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getUserName = () => {
    if (user.firstName) {
      return user.firstName;
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return 'Utilizador';
  };

  const getUserInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.firstName) {
      return user.firstName.substring(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    }}>
      {/* User Avatar */}
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: user.profileImageUrl ? 'transparent' : 'linear-gradient(135deg, #10b981, #3b82f6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '12px',
        fontWeight: '600',
        border: '2px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="Perfil"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          getUserInitials()
        )}
      </div>

      {/* User Info */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
      }}>
        <span style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151'
        }}>
          {getUserName()}
        </span>
        {user.email && (
          <span style={{
            fontSize: '12px',
            color: '#6b7280'
          }}>
            {user.email}
          </span>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        style={{
          background: '#f3f4f6',
          border: '1px solid #d1d5db',
          color: '#374151',
          padding: '0.5rem 0.75rem',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: '500',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#e5e7eb';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = '#f3f4f6';
        }}
      >
        Sair
      </button>
    </div>
  );
}