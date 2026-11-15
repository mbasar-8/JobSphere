<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>

<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
        <tr>
            <td align="center">

                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:40px;max-width:600px;width:100%;">

                    <tr>
                        <td align="center">

                            <h1 style="margin:0;color:#2563eb;font-size:28px;">
                                JobSphere
                            </h1>

                            <p style="margin-top:8px;color:#64748b;font-size:15px;">
                                Email Verification
                            </p>

                        </td>
                    </tr>

                    <tr>
                        <td style="padding-top:30px;color:#334155;font-size:16px;line-height:28px;">

                            <p>Hello,</p>

                            <p>
                                Thank you for creating your JobSphere account.
                            </p>

                            <p>
                                Please use the verification code below to verify your email address.
                            </p>

                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding:35px 0;">

                            <div
                                style="
                                display:inline-block;
                                background:#eff6ff;
                                border:2px dashed #2563eb;
                                color:#2563eb;
                                font-size:36px;
                                font-weight:bold;
                                letter-spacing:8px;
                                padding:18px 40px;
                                border-radius:12px;
                            ">
                                {{ $otp }}
                            </div>

                        </td>
                    </tr>

                    <tr>
                        <td style="color:#475569;font-size:15px;line-height:28px;">

                            <p>
                                This verification code will expire in
                                <strong>10 minutes</strong>.
                            </p>

                            <p>
                                If you did not create a JobSphere account,
                                you can safely ignore this email.
                            </p>

                        </td>
                    </tr>

                    <tr>
                        <td style="padding-top:35px;border-top:1px solid #e2e8f0;">

                            <p style="margin:0;color:#64748b;font-size:14px;">
                                Thanks,
                            </p>

                            <p style="margin-top:6px;font-weight:bold;color:#1e293b;">
                                JobSphere Team
                            </p>

                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>
