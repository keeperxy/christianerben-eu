import { Resend } from 'resend';

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function onRequestPost(context) {
  const { request } = context;
  const body = await request.json();
  const resend = new Resend(context.env.RESEND_API_KEY);

  if (body.verify !== '') {
    return Response.json({ error: 'Error' }, { status: 400 });
  }

  const safeName = escapeHtml(body.name);
  const safeEmail = escapeHtml(body.email);
  const safeMessage = escapeHtml(body.message).replace(/\n/g, '<br>');

  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html dir="ltr" lang="en">
    <head>
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <meta name="x-apple-disable-message-reformatting" />
        <style>
        @font-face {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 400;
            mso-font-alt: 'Arial';
            src: url(https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap) format('woff2');
        }

        * {
            font-family: 'Inter', Arial;
        }
        </style>
    </head>
    <body
        style="padding-top:40px;padding-bottom:40px;font-family:Inter, Arial, sans-serif;background-color:hsl(225, 25%, 12%)">
        <!--$-->
        <div
        style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0"
        data-skip-in-text="true">
        New contact form submission
        <div>
             ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
        </div>
        </div>
        <table
        align="center"
        width="100%"
        border="0"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
        style="margin-left:auto;margin-right:auto;padding:20px;max-width:600px;border-radius:8px;background-color:hsl(225, 25%, 16%)">
        <tbody>
            <tr style="width:100%">
            <td>
                <table
                align="center"
                width="100%"
                border="0"
                cellpadding="0"
                cellspacing="0"
                role="presentation">
                <tbody>
                    <tr>
                    <td>
                        <div
                        style="background:linear-gradient(to right, hsl(153, 65%, 65%), hsl(262, 61%, 74%));padding:2px;border-radius:12px;margin-bottom:24px;margin-top:24px">
                        <div
                            style="background-color:hsl(225, 25%, 16%);border-radius:10px;padding:16px 20px">
                            <h1
                            style="font-size:24px;font-weight:700;margin:0px;color:hsl(210, 40%, 98%);text-align:center;">
                            New Contact Form Submission
                            </h1>
                        </div>
                        </div>
                        <p
                        style="font-size:16px;margin-bottom:16px;line-height:24px;color:hsl(215, 20.2%, 65.1%);margin-top:16px">
                        You have received a new message from your website contact
                        form.
                        </p>
                        <table
                        align="center"
                        width="100%"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="border-radius:8px;padding:16px;margin-top:24px;margin-bottom:24px;background-color:hsl(217.2, 32.6%, 17.5%)">
                        <tbody>
                            <tr>
                            <td>
                                <p
                                style="font-size:14px;font-weight:700;margin-bottom:4px;line-height:24px;color:hsl(153, 65%, 65%);margin-top:16px">
                                From:
                                </p>
                                <p
                                style="font-size:16px;margin-bottom:16px;line-height:24px;color:hsl(210, 40%, 98%);margin-top:16px">
                                ${safeEmail}
                                </p>
                                <p
                                style="font-size:14px;font-weight:700;margin-bottom:4px;line-height:24px;color:hsl(153, 65%, 65%);margin-top:16px">
                                Name:
                                </p>
                                <p
                                style="font-size:16px;margin-bottom:16px;line-height:24px;color:hsl(210, 40%, 98%);margin-top:16px">
                                ${safeName}
                                </p>
                                <p
                                style="font-size:14px;font-weight:700;margin-bottom:4px;line-height:24px;color:hsl(153, 65%, 65%);margin-top:16px">
                                Message:
                                </p>
                                <p
                                style="font-size:16px;line-height:24px;color:hsl(210, 40%, 98%);margin-top:16px;margin-bottom:16px">
                                ${safeMessage}
                                </p>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                        <div
                        style="background:linear-gradient(to right, hsl(153, 65%, 65%), hsl(262, 61%, 74%));padding:2px;border-radius:8px;margin-bottom:16px;display:inline-block;width:100%;box-sizing:border-box">
                        <a
                            href="mailto:${safeEmail}"
                            style="display:block;padding:12px 20px;border-radius:6px;font-weight:600;text-decoration:none;color:hsl(210, 40%, 98%);background-color:hsl(225, 25%, 16%);text-align:center;box-sizing:border-box;font-size:16px"
                            >Reply to this message</a
                        >
                        </div>
                        <p
                        style="font-size:14px;margin-top:32px;line-height:24px;color:hsl(215, 20.2%, 65.1%);margin-bottom:16px">
                        This email was sent to you because you received a
                        submission from the contact form on your website.
                        </p>
                    </td>
                    </tr>
                </tbody>
                </table>
            </td>
            </tr>
        </tbody>
        </table>
        <!--7--><!--/$-->
    </body>
    </html>`;

  try {
    const data = await resend.emails.send({
      from: `${safeName} <christianerben-eu@christianerben.eu>`,
      replyTo: [body.email],
      to: ['christian.erben@degit.de'],
      subject: `Contact Form Submission from ${safeName} on ${new Date().toISOString()}`,
      html: html,
    });
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: 'Failed to send email', details: err.message }, { status: 500 });
  }
}
