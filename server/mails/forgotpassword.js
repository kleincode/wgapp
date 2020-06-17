const baseUrl = process.env.SERVER_BASE_URL || "http://localhost";

module.exports = ({ firstname, lastname, email, token }) => `

Hi ${firstname},
<p>
    you are receiving this email because someone clicked the '<i>Forgot password</i>' button.
    If that was you, please click the following link to set a new password:
</p>
<p>
    <a href="${baseUrl}/resetpassword/${encodeURIComponent(token)}" target="_blank">Reset password</a><br />
</p>
<p>
    If that wasn't you, I recommend you consider moving to a different country or hiding behind a bush. Your identity has been leaked.
</p>
<br />
<p>
    With calming greetings,<br />
    Roomie.
</p>
<p>
    PS: That link will destroy itself in one hour. Act fast.
</p>

`;