export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
}

export function appointmentErrorMessage(code?: string) {
  if (code === 'mail_unavailable') {
    return 'E-posta hizmeti şu anda kullanılamıyor; talebiniz iletilemedi. Yazdıklarınız bu ekranda korunuyor. Randevu için telefonla bize ulaşabilirsiniz.';
  }
  return 'Talebinizin iletildiği doğrulanamadı. Yazdıklarınız bu ekranda korunuyor. Yeniden göndermeden önce telefonla teyit edebilirsiniz.';
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
