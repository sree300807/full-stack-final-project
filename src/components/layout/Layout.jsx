import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import TransactionModal from '../transactions/TransactionModal';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addTxModalOpen, setAddTxModalOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="app-main">
        <Header
          onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
          onOpenAddModal={() => setAddTxModalOpen(true)}
        />

        <main className="page-container">
          <Outlet context={{ openAddTransaction: () => setAddTxModalOpen(true) }} />
        </main>
      </div>

      <TransactionModal
        isOpen={addTxModalOpen}
        onClose={() => setAddTxModalOpen(false)}
      />
    </div>
  );
}
