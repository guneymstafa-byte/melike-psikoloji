type MailEnvironment = {
  EMAIL_USER?: string;
  EMAIL_PASS?: string;
  RECEIVER_EMAIL?: string;
};

export function gmailConfiguration(env: MailEnvironment) {
  const user = env.EMAIL_USER?.trim() ?? '';
  // Google displays application passwords in groups separated by spaces.
  const pass = env.EMAIL_PASS?.replace(/\s/g, '') ?? '';
  const to = env.RECEIVER_EMAIL?.trim() || 'melikeermumcu0@gmail.com';
  const address = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
  if (!address.test(user) || !address.test(to) || !pass) return null;
  return { user, pass, to };
}

export function appointmentMailFailure(error: unknown) {
  const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : 'unknown';
  // Authentication and envelope errors happen before a message can be accepted.
  const unavailable = code === 'EAUTH' || code === 'EENVELOPE';
  return { logCode: code, status: unavailable ? 503 : 500, code: unavailable ? 'mail_unavailable' : 'delivery_unknown' };
}
