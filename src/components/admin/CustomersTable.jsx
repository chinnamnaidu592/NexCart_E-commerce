import React, { useState } from 'react';
import Modal from '@/components/common/Modal';
import Pagination from '@/components/products/Pagination';
import { Search, Eye, MapPin, Phone, Mail } from 'lucide-react';

export default function CustomersTable({ customers = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = customers.filter((c) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const name = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
    return (
      name.includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.username?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-white rounded-xl border border-[#E7E5E4] overflow-hidden text-left shadow-xs">
      {/* Search Header */}
      <div className="p-6 border-b border-[#F5F5F4] flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search clients by name, email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs bg-[#F5F5F4] border border-[#E7E5E4] rounded-sm pl-9 pr-4 py-2 text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1C1917]"
          />
          <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.5]" />
        </div>
        <span className="text-xs font-mono text-[#78716C]">
          {filtered.length} client records
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#F5F5F4] text-[#78716C] uppercase tracking-[0.12em] font-semibold border-b border-[#E7E5E4]">
              <th scope="col" className="py-3 px-6">Client Identity</th>
              <th scope="col" className="py-3 px-6">Email Address</th>
              <th scope="col" className="py-3 px-6">Telephone</th>
              <th scope="col" className="py-3 px-6">Privilege Level</th>
              <th scope="col" className="py-3 px-6 text-right">Dossier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F4]">
            {paginated.map((user) => (
              <tr key={user.id} className="hover:bg-[#FAFAF9] transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.image || '/src/assets/images/avatar_collector_portrait_1791282676033.jpg'}
                      alt={user.firstName}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-xs object-cover bg-[#F5F5F4] border border-[#E7E5E4]"
                    />
                    <div>
                      <p className="font-medium text-[#1C1917]">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-[10px] font-mono text-[#A8A29E]">@{user.username}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-[#57534E] font-mono">{user.email}</td>
                <td className="py-4 px-6 text-[#57534E] font-mono">{user.phone || '+1 (555) 019-2834'}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2 py-0.5 rounded-none border text-[10px] font-mono uppercase tracking-wider font-semibold ${
                      user.role === 'admin'
                        ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                        : 'bg-[#F5F5F4] text-[#57534E] border-[#E7E5E4]'
                    }`}
                  >
                    {user.role || 'client'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    type="button"
                    onClick={() => setSelectedCustomer(user)}
                    className="p-1.5 text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
                    aria-label={`View details for ${user.firstName}`}
                  >
                    <Eye className="w-4 h-4 stroke-[1.5]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-[#F5F5F4]">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          scrollToTop={false}
        />
      </div>

      {/* Customer Details Modal */}
      <Modal
        isOpen={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomer(null)}
        title="Client Dossier"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-[#F5F5F4]">
              <img
                src={selectedCustomer.image || '/src/assets/images/avatar_collector_portrait_1791282676033.jpg'}
                alt={selectedCustomer.firstName}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-xs object-cover bg-[#F5F5F4] border border-[#E7E5E4]"
              />
              <div>
                <h4 className="font-sans text-xl font-normal text-[#1C1917]">
                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                </h4>
                <p className="text-xs font-mono text-[#78716C]">@{selectedCustomer.username}</p>
                <span className="inline-block mt-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 border border-[#E7E5E4] bg-[#F5F5F4] text-[#57534E]">
                  {selectedCustomer.role || 'Verified Client'}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 text-[#57534E]">
                <Mail className="w-4 h-4 text-[#78716C] stroke-[1.5] shrink-0" />
                <span className="font-mono">{selectedCustomer.email}</span>
              </div>
              <div className="flex items-center gap-3 text-[#57534E]">
                <Phone className="w-4 h-4 text-[#78716C] stroke-[1.5] shrink-0" />
                <span className="font-mono">{selectedCustomer.phone || '+91 98765 43210'}</span>
              </div>
              <div className="flex items-center gap-3 text-[#57534E]">
                <MapPin className="w-4 h-4 text-[#78716C] stroke-[1.5] shrink-0" />
                <span className="leading-relaxed">
                  {selectedCustomer.address
                    ? `${selectedCustomer.address.address || ''}, ${selectedCustomer.address.city || ''}, ${selectedCustomer.address.state || ''}`
                    : 'Flat 402, Lotus Grandeur, Road No. 36, Jubilee Hills, Hyderabad, Telangana - 500033'}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
