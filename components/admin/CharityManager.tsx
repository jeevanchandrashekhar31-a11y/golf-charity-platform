'use client';

import { useState } from 'react';
import { Charity } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Loader2, Star, Eye, EyeOff } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  name: '', description: '', category: '', website_url: '',
  logo_url: '', banner_url: '', is_featured: false, is_active: true,
};

export default function CharityManager({ initialCharities }: { initialCharities: Charity[] }) {
  const [charities, setCharities] = useState<Charity[]>(initialCharities);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Charity | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (c: Charity) => {
    setEditTarget(c);
    setForm({
      name: c.name,
      description: c.description || '',
      category: c.category || '',
      website_url: c.website_url || '',
      logo_url: c.logo_url || '',
      banner_url: c.banner_url || '',
      is_featured: c.is_featured || false,
      is_active: c.is_active !== false,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setLoading(true);
    try {
      const method = editTarget ? 'PUT' : 'POST';
      const body = editTarget ? { id: editTarget.id, ...form } : form;
      const res = await fetch('/api/admin/charities', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (editTarget) {
        setCharities(prev => prev.map(c => c.id === editTarget.id ? data.data : c));
        toast.success('Charity updated');
      } else {
        setCharities(prev => [data.data, ...prev]);
        toast.success('Charity created');
      }
      setDialogOpen(false);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string, field: 'is_featured' | 'is_active', current: boolean) => {
    setTogglingId(id + field);
    try {
      const res = await fetch('/api/admin/charities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, [field]: !current }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCharities(prev => prev.map(c => c.id === id ? { ...c, [field]: !current } : c));
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Soft-delete this charity? Users can no longer select it, but existing links are preserved.')) return;
    try {
      const res = await fetch('/api/admin/charities', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (!res.ok) throw new Error('Delete failed');
      setCharities(prev => prev.map(c => c.id === id ? { ...c, is_active: false } : c));
      toast.success('Charity deactivated');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={openCreate} className="bg-[#10B981] hover:bg-[#10B981]/90 text-white h-11 px-6 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <Plus className="w-4 h-4 mr-2" /> Add Charity
        </Button>
      </div>

      <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden shadow-xl overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#0A0A0F] text-white/50 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Charity</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Featured</th>
              <th className="px-6 py-4">Active</th>
              <th className="px-6 py-4">Total Raised</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white">
            {charities.map(c => (
              <tr key={c.id} className={`hover:bg-white/5 transition-colors ${!c.is_active ? 'opacity-40' : ''}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {c.logo_url ? (
                      <img src={c.logo_url} alt={c.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#10B981]/20 flex items-center justify-center text-xs font-bold text-[#10B981]">
                        {c.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="font-bold">{c.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{c.category || '—'}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggle(c.id, 'is_featured', !!c.is_featured)}
                    disabled={togglingId === c.id + 'is_featured'}
                    className="focus:outline-none"
                  >
                    <Star className={`w-5 h-5 transition-colors ${c.is_featured ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-white/20 hover:text-white/50'}`} />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggle(c.id, 'is_active', !!c.is_active)}
                    disabled={togglingId === c.id + 'is_active'}
                    className="focus:outline-none flex items-center gap-1.5 text-xs font-medium"
                  >
                    {c.is_active
                      ? <><Eye className="w-4 h-4 text-[#10B981]" /><span className="text-[#10B981]">Active</span></>
                      : <><EyeOff className="w-4 h-4 text-white/30" /><span className="text-white/30">Hidden</span></>
                    }
                  </button>
                </td>
                <td className="px-6 py-4 font-bold text-[#10B981]">{formatCurrency(c.total_contributions || 0)}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(c)} className="text-white hover:bg-white/10">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)} className="text-red-400 hover:bg-red-400/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#111827] border-white/10 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-syne text-xl">{editTarget ? 'Edit Charity' : 'Add New Charity'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {[
              { label: 'Charity Name *', key: 'name', placeholder: 'e.g. Ocean Cleanup Foundation' },
              { label: 'Category', key: 'category', placeholder: 'e.g. Environment, Health, Education' },
              { label: 'Website URL', key: 'website_url', placeholder: 'https://...' },
              { label: 'Logo URL', key: 'logo_url', placeholder: 'https://...' },
              { label: 'Banner URL', key: 'banner_url', placeholder: 'https://...' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">{label}</label>
                <Input
                  value={(form as any)[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="bg-[#0A0A0F] border-white/10 text-white focus-visible:ring-[#10B981]"
                />
              </div>
            ))}

            <div>
              <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={4}
                placeholder="What does this charity do?"
                className="w-full bg-[#0A0A0F] border border-white/10 rounded-md text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#10B981] resize-none"
              />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
                  className="w-4 h-4 accent-[#F59E0B]"
                />
                <span className="text-sm text-white">Featured charity</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                  className="w-4 h-4 accent-[#10B981]"
                />
                <span className="text-sm text-white">Active (visible)</span>
              </label>
            </div>

            <div className="flex gap-3 pt-2 border-t border-white/5">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1 border-white/20 text-white bg-transparent hover:bg-white/10">
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading} className="flex-1 bg-[#10B981] hover:bg-[#10B981]/90 text-white">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editTarget ? 'Save Changes' : 'Create Charity'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
