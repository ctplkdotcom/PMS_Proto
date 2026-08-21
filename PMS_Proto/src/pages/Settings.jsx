import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../data/constants';
import { useTranslation } from '../i18n/LanguageContext';
import { User, Shield, Bell, Globe, Save } from 'lucide-react';

export default function Settings() {
  const { role } = useAuth();
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('profile');

  const sections = [
    { id: 'profile', label: t('settings.profile'), icon: User },
    { id: 'roles', label: t('settings.roles'), icon: Shield },
    { id: 'notifications', label: t('settings.notifications'), icon: Bell },
    { id: 'localization', label: t('settings.localization'), icon: Globe },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1400, display: 'flex', gap: 24 }}>
      {/* Left Nav */}
      <div style={{ width: 240, flexShrink: 0 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--foreground)', letterSpacing: '-0.02em', marginBottom: 24 }}>{t('settings.settings')}</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 8, border: 'none',
                background: activeSection === id ? 'var(--info-bg)' : 'transparent',
                color: activeSection === id ? 'var(--info)' : '#64748B',
                fontWeight: activeSection === id ? 600 : 400,
                fontSize: 13, cursor: 'pointer', textAlign: 'left', width: '100%',
              }}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, background: '#fff', borderRadius: 12, border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)', padding: 24 }}>
        {activeSection === 'profile' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)', marginBottom: 20 }}>{t('settings.profile.title')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{t('settings.profile.displayName')}</label>
                <input defaultValue={role ? ROLES[role].name : ''} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{t('settings.profile.email')}</label>
                <input defaultValue="user@gov.hk" disabled style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, outline: 'none', backgroundColor: '#F8FAFC', color: '#94A3B8' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{t('settings.profile.role')}</label>
                <input defaultValue={role ? ROLES[role].label : ''} disabled style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, outline: 'none', backgroundColor: '#F8FAFC', color: '#94A3B8' }} />
              </div>
              <button style={{ padding: '10px 20px', fontSize: 13, fontWeight: 600, borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginTop: 8 }}>
                <Save size={14} /> {t('settings.profile.save')}
              </button>
            </div>
          </div>
        )}

        {activeSection === 'roles' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)', marginBottom: 20 }}>{t('settings.roles.title')}</h2>
            <div style={{ background: '#F8FAFC', borderRadius: 8, padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>{t('settings.roles.currentRole')} {role ? ROLES[role].label : 'N/A'}</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>{role ? ROLES[role].subtext : ''}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
              {Object.entries(ROLES).map(([key, r]) => (
                <div key={key} style={{ padding: 16, borderRadius: 8, border: `1px solid ${key === role ? 'var(--info)' : 'var(--border)'}`, background: key === role ? 'var(--info-bg)' : '#fff' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground)', marginBottom: 4 }}>{r.label}</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginBottom: 8 }}>{r.subtext}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {r.canCreateWO && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'var(--success-bg)', color: 'var(--success)' }}>Create WO</span>}
                    {r.canSubmitWO && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'var(--info-bg)', color: 'var(--info)' }}>Submit WO</span>}
                    {r.canEditTaskDetails && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'var(--warning-bg)', color: '#B45309' }}>Edit Tasks</span>}
                    {r.canAddMapAssets && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#F3E8FF', color: '#7C3AED' }}>Map Assets</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)', marginBottom: 20 }}>{t('settings.notif.title')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500 }}>
              {[
                { label: t('settings.notif.woStatus'), desc: t('settings.notif.woStatusDesc') },
                { label: t('settings.notif.complianceExpiry'), desc: t('settings.notif.complianceExpiryDesc') },
                { label: t('settings.notif.approvals'), desc: t('settings.notif.approvalsDesc') },
                { label: t('settings.notif.system'), desc: t('settings.notif.systemDesc') },
              ].map(({ label, desc }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#F8FAFC', borderRadius: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>{label}</div>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{desc}</div>
                  </div>
                  <div style={{ width: 40, height: 22, borderRadius: 11, background: 'var(--success)', padding: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'localization' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)', marginBottom: 20 }}>{t('settings.loc.title')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{t('settings.loc.language')}</label>
                <select style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, outline: 'none', background: '#fff' }}>
                  <option>English</option>
                  <option>\u7E41\u9AD4\u4E2D\u6587</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{t('settings.loc.dateFormat')}</label>
                <select style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, outline: 'none', background: '#fff' }}>
                  <option>YYYY-MM-DD</option>
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{t('settings.loc.currency')}</label>
                <select style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, outline: 'none', background: '#fff' }}>
                  <option>HKD ($)</option>
                  <option>USD ($)</option>
                </select>
              </div>
              <button style={{ padding: '10px 20px', fontSize: 13, fontWeight: 600, borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginTop: 8 }}>
                <Save size={14} /> {t('settings.loc.save')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
