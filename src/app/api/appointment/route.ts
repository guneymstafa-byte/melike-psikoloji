import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { parseAppointment, escapeHtml } from '../../../lib/appointment';
import { gmailConfiguration, appointmentMailFailure } from '../../../lib/appointment-mail';

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    let body: unknown;
    try { body = await request.json(); } catch { return NextResponse.json({ error: 'Geçersiz form.' }, { status: 400 }); }
    const parsed = parseAppointment(body);
    if (!parsed) return NextResponse.json({ error: 'Ad, telefon ve geçerli bir e-posta adresi gereklidir.' }, { status: 400 });
    const { name, email } = parsed;
    const safe = Object.fromEntries(Object.entries(parsed).map(([key, value]) => [key, escapeHtml(value)]));
    const config = gmailConfiguration({
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASS: process.env.EMAIL_PASS,
      RECEIVER_EMAIL: process.env.RECEIVER_EMAIL,
    });
    if (!config) {
      console.error('appointment_mail_configuration_missing');
      return NextResponse.json({ code: 'mail_unavailable', error: 'Randevu formu şu anda kullanılamıyor. Lütfen telefonla ulaşın.' }, { status: 503 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      connectionTimeout: 8_000,
      greetingTimeout: 8_000,
      socketTimeout: 10_000,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    const mailOptions = {
      from: { name: 'Klinik Psk. Melike Ermumcu Web', address: config.user },
      to: config.to,
      replyTo: email || undefined,
      subject: `Yeni Randevu Talebi: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #2D3748; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #7A9A8B; color: #ffffff; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 20px;">Yeni Randevu Talebi</h2>
            <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">Web sitesi üzerinden iletildi</p>
          </div>
          <div style="padding: 24px; background-color: #FAF8F5;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-weight: bold; width: 140px;">Danışan Adı:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0;">${safe.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-weight: bold;">Telefon:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0;"><a href="tel:${safe.phone}" style="color: #5E7D6F; text-decoration: none; font-weight: bold;">${safe.phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-weight: bold;">E-Posta:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0;">${safe.email}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-weight: bold;">Görüşme Tercihi:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0;">${safe.service}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-weight: bold;">Tercih Edilen Zaman:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0;">${safe.date || 'Belirtilmedi'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; vertical-align: top; font-weight: bold;">Görüşme Nedeni:</td>
                <td style="padding: 10px 0;">${safe.note || 'Belirtilmedi'}</td>
              </tr>
            </table>
          </div>
          <div style="background-color: #F7EDE8; padding: 12px; text-align: center; font-size: 12px; color: #64748B;">
            Bu mesaj web sitesindeki iletişim formu aracılığıyla otomatik oluşturulmuştur.
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Randevu talebiniz başarıyla iletildi.' });
  } catch (error) {
    const failure = appointmentMailFailure(error);
    console.error('appointment_mail_failed', { code: failure.logCode });
    return NextResponse.json(
      { code: failure.code, error: 'E-posta gönderimi tamamlanamadı. Lütfen telefonla ulaşın.' },
      { status: failure.status }
    );
  }
}
