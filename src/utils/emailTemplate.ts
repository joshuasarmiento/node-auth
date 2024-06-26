export const emailVerificationTemplate = (verificationUrl: string, userName: string) => `
    <body style="font-family: 'Poppins', Arial, sans-serif">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
            <td align="center" style="padding: 20px;">
                <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #cccccc;">
                    <!-- Header -->
                    <tr>
                        <td class="header" style="background-color: #171717; padding: 40px; text-align: center; color: white; font-size: 24px;">
                            Verify Your Email Address
                        </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                        <td class="body" style="padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                        Hi, ${userName}! <br>
                        Please click the button below to verify your email address.
                        <br><br>
                        </td>
                    </tr>
                    <!-- Call to action Button -->
                    <tr>
                        <td style="padding: 0px 40px 0px 40px; text-align: center;">
                            <!-- CTA Button -->
                            <table cellspacing="0" cellpadding="0" style="margin: auto;">
                                <tr>
                                    <td align="center" style="background-color: #171717; padding: 10px 20px; border-radius: 5px;">
                                        <a href="${verificationUrl}" target="_blank" style="color: #ffffff; text-decoration: none; font-weight: bold;">Verify My Email</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                    <td class="body" style="padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                        If you did not create an account, no further action is required.
                    </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td class="footer" style="background-color: #333333; padding: 40px; text-align: center; color: white; font-size: 14px;">
                        Copyright &copy; ${new Date().getFullYear()} | Auth Vue
                        </td>
                    </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
`