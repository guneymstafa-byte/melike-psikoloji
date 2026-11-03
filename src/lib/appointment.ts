export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
}

export function parseAppointment(input: unknown) {
  if (!input || typeof input !== 'object') return null;
  const data = input as Record<string, unknown>;
  const text = (key: string, max: number) => typeof data[key] === 'string' ? (data[key] as string).trim().slice(0, max) : '';
  const result = {
    name: text('name', 120).replace(/[\r\n]/g, ' '),
    phone: text('phone', 40),
    email: text('email', 254),
    service: text('service', 200) || text('type', 200),
    date: text('date', 100) || text('datePreference', 100),
    note: text('note', 3000),
  };
  if (!result.name || !/^[+\d\s()-]{7,40}$/.test(result.phone) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)) return null;
  return result;
}
