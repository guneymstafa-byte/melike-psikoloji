import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, type, datePreference, note } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Ad Soyad ve Telefon alanları zorunludur.' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Klinik Psk. Melike Ermumcu Web" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL || 'melikeermumcu0@gmail.com',
      replyTo: email || undefined,
      subject: `🗓️ Yeni Randevu Talebi: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #2D3748; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #7A9A8B; color: #ffffff; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 20px;">Yeni Randevu Talebi</h2>
            <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">melikeermumcu.com üzerinden iletildi</p>
          </div>
          <div style="padding: 24px; background-color: #FAF8F5;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-weight: bold; width: 140px;">Danışan Adı:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-weight: bold;">Telefon:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0;"><a href="tel:${phone}" style="color: #5E7D6F; text-decoration: none; font-weight: bold;">${phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-weight: bold;">E-Posta:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0;">${email || 'Belirtilmedi'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-weight: bold;">Görüşme Tercihi:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0;">${type}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-weight: bold;">Tercih Edilen Zaman:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0;">${datePreference || 'Belirtilmedi'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; vertical-align: top; font-weight: bold;">Görüşme Nedeni:</td>
                <td style="padding: 10px 0;">${note || 'Belirtilmedi'}</td>
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
    console.error('Randevu maili gönderme hatası:', error);
    return NextResponse.json(
      { error: 'Mail gönderilirken bir sunucu hatası oluştu.' },
      { status: 500 }
    );
  }
}