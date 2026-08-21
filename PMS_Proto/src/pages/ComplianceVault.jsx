import { useState, useMemo } from 'react';
import { COMPLIANCE_DOCS, COMPLIANCE_CATEGORIES, PROPERTIES } from '../data/constants';
import { Search, ShieldCheck, AlertTriangle, CheckCircle, Clock, Upload, X, ChevronDown, ChevronUp } from 'lucide-react';

const STATUS_OPTIONS = ['All', 'Valid', 'Expiring', 'Expired'];

export default function ComplianceVault() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [centerFilter, setCenterFilter] = useState('All');
  const [sortCol, setSortCol] = useState('nextInspection');
  const [sortDir, setSortDir] = useState('asc');

  const totalDocs = COMPLIANCE_DOCS.length;
  const validCount = COMPLIANCE_DOCS.filter((d) => d.status === 'Valid').length;
  const expiringCount = COMPLIANCE_DOCS.filter((d) => d.status === 'Expiring').length;
  const expiredCount = COMPLIANCE_DOCS.filter((d) => d.status === 'Expired').length;
  const complianceRate = totalDocs > 0 ? Math.round((validCount / totalDocs) * 100) : 0;

  const centerOptions = useMemo(() => ['All', ...PROPERTIES.map((p) => p.name)], []);

  const filtered = useMemo(() => {
    let list = COMPLIANCE_DOCS.filter((d) => {
      if (categoryFilter !== 'All' && d.category !== categoryFilter) return false;
      if (statusFilter !== 'All' && d.status !== statusFilter) return false;
      if (centerFilter !== 'All' && d.center !== centerFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return d.name.toLowerCase().includes(q) || d.center.toLowerCase().includes(q) || d.documentRef.toLowerCase().includes(q) || d.issuedBy.toLowerCase().includes(q);
      }
      return true;
    });
    list.sort((a, b) => {
      const va = a[sortCol] ?? '';
      const vb = b[sortCol] ?? '';
      const cmp = typeof va === 'string' ? va.localeCompare(vb) : va - vb;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [search, categoryFilter, statusFilter, centerFilter, sortCol, sortDir]);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const statusColors = {
    Valid: { bg: 'var(--success-bg)', color: 'var(--success)' },
    Expiring: { bg: '#FEF3C7', color: '#B45309' },
    Expired: { bg: '#FEE2E2', color: '#DC2626' },
  };

  const activeFilters = [];
  if (categoryFilter !== 'All') activeFilters.push({ key: 'cat', label: `Category: ${categoryFilter}`, clear: () => setCategoryFilter('All') });
  if (statusFilter !== 'All') activeFilters.push({ key: 'status', label: `Status: ${statusFilter}`, clear: () => setStatusFilter('All') });
  if (centerFilter !== 'All') activeFilters.push({ key: 'center', label: centerFilter, clear: () => setCenterFilter('All') });

  return (
    <div style={{ padding: 24, maxWidth: 1400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--foreground)', letterSpacing: '-0.02em' }}>Compliance Vault</h1>
          <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>{totalDocs} documents across {PROPERTIES.length} properties</p>
        </div>
        <button style={{ padding: '10px 20px', fontSize: 13, fontWeight: 600, borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Upload size={16} /> Upload Document
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        <SummaryCard icon={<CheckCircle size={20} color="var(--success)" />} iconBg="var(--success-bg)" value={validCount} label="Valid" />
        <SummaryCard icon={<AlertTriangle size={20} color="#B45309" />} iconBg="#FEF3C7" value={expiringCount} label="Expiring Soon" />
        <SummaryCard icon={<Clock size={20} color="#DC2626" />} iconBg="#FEE2E2" value={expiredCount} label="Expired" />
        <SummaryCard icon={<ShieldCheck size={20} color="var(--info)" />} iconBg="var(--info-bg)" value={`${complianceRate}%`} label="Compliance Rate" />
      </div>

      {/* Category Coverage */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)', padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)', marginBottom: 14 }}>Coverage by Category</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {COMPLIANCE_CATEGORIES.map((cat) => {
            const catDocs = COMPLIANCE_DOCS.filter((d) => d.category === cat);
            const catValid = catDocs.filter((d) => d.status === 'Valid').length;
            const pct = catDocs.length > 0 ? Math.round((catValid / catDocs.length) * 100) : 0;
            return (
              <div key={cat} style={{ padding: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>{cat}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: pct === 100 ? 'var(--success)' : '#B45309' }}>{pct}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: '#E2E8F0', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, borderRadius: 3, background: pct === 100 ? 'var(--success)' : '#F59E0B', transition: 'width 0.3s' }} />
                </div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>{catValid}/{catDocs.length} valid</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search documents, property, or reference..." style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, background: '#fff', outline: 'none' }} />
        </div>
        <FilterDropdown label="Category" options={['All', ...COMPLIANCE_CATEGORIES]} selected={categoryFilter} onSelect={setCategoryFilter} />
        <FilterDropdown label="Status" options={STATUS_OPTIONS} selected={statusFilter} onSelect={setStatusFilter} />
        <FilterDropdown label="Property" options={centerOptions} selected={centerFilter} onSelect={setCenterFilter} />
      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          {activeFilters.map((f) => (
            <span key={f.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: 'var(--info-bg)', color: 'var(--primary)', border: '1px solid rgba(37,99,235,0.2)' }}>
              {f.label}
              <button onClick={f.clear} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: 'var(--primary)' }}><X size={12} /></button>
            </span>
          ))}
          <button onClick={() => { setCategoryFilter('All'); setStatusFilter('All'); setCenterFilter('All'); }} style={{ fontSize: 12, color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}>Clear all</button>
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
                {[
                  { key: 'name', label: 'Document', width: undefined },
                  { key: 'category', label: 'Category', width: 130 },
                  { key: 'center', label: 'Property', width: 200 },
                  { key: 'documentRef', label: 'Ref', width: 120 },
                  { key: 'inspectionDate', label: 'Inspected', width: 110 },
                  { key: 'nextInspection', label: 'Next Due', width: 110 },
                  { key: 'status', label: 'Status', width: 100 },
                  { key: 'issuedBy', label: 'Issued By', width: 150 },
                ].map((col) => (
                  <th key={col.key} onClick={() => handleSort(col.key)} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#64748B', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap', width: col.width, background: sortCol === col.key ? '#F1F5F9' : undefined }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {col.label}
                      {sortCol === col.key ? (sortDir === 'asc' ? <ChevronDown size={11} color="var(--info)" /> : <ChevronUp size={11} color="var(--info)" />) : <span style={{ fontSize: 10, color: '#CBD5E1' }}>&#8597;</span>}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id} style={{ borderBottom: '1px solid var(--border)' }} onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>{doc.name}</td>
                  <td style={{ padding: '10px 16px' }}><span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 10, background: '#F1F5F9', color: '#475569' }}>{doc.category}</span></td>
                  <td style={{ padding: '10px 16px', fontSize: 12, color: '#64748B', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.center}</td>
                  <td style={{ padding: '10px 16px', fontSize: 12, color: '#94A3B8', fontFamily: 'monospace' }}>{doc.documentRef}</td>
                  <td style={{ padding: '10px 16px', fontSize: 12, color: '#64748B' }}>{doc.inspectionDate}</td>
                  <td style={{ padding: '10px 16px', fontSize: 12, color: '#64748B' }}>{doc.nextInspection}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 10, background: statusColors[doc.status]?.bg, color: statusColors[doc.status]?.color }}>{doc.status}</span>
                  </td>
                  <td style={{ padding: '10px 16px', fontSize: 12, color: '#64748B' }}>{doc.issuedBy}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 48, textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>
                  <div style={{ fontSize: 16, marginBottom: 8, color: '#CBD5E1' }}>No documents found</div>
                  <div>Try adjusting your search or filters</div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon, iconBg, value, label }) {
  return (
    <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: 16, border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <div><div style={{ fontSize: 20, fontWeight: 800, color: 'var(--foreground)' }}>{value}</div><div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{label}</div></div>
    </div>
  );
}

function FilterDropdown({ label, options, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ padding: '8px 12px', fontSize: 12, fontWeight: 600, borderRadius: 8, border: '1px solid var(--border)', background: selected !== 'All' ? 'var(--info-bg)' : '#fff', color: selected !== 'All' ? 'var(--info)' : '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}: {selected}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
          <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, minWidth: 220, maxHeight: 300, overflowY: 'auto', background: '#fff', border: '1px solid var(--border)', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, padding: 4 }}>
            {options.map((opt) => (
              <button key={opt} onClick={() => { onSelect(opt); setOpen(false); }} style={{ display: 'block', width: '100%', padding: '7px 10px', fontSize: 12, border: 'none', background: selected === opt ? 'var(--info-bg)' : 'transparent', color: selected === opt ? 'var(--info)' : '#475569', cursor: 'pointer', borderRadius: 4, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
