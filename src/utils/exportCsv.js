// Utility to export transactions to CSV file

export function exportTransactionsToCsv(transactions, currencyCode = 'INR') {
  if (!transactions || transactions.length === 0) {
    return false;
  }

  const headers = ['ID', 'Date', 'Type', 'Category', 'Description', 'Amount', 'Currency', 'Notes'];

  const rows = transactions.map((t) => [
    `"${t.id}"`,
    `"${t.date}"`,
    `"${t.type.toUpperCase()}"`,
    `"${t.category}"`,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    t.amount,
    `"${currencyCode}"`,
    `"${(t.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `LEDGER_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}
