const baseUrl = process.env.SERVER_BASE_URL || "http://localhost";

module.exports = ({ firstname, lastname, email, token }) => `

Hi ${firstname},
<p>
    welcome on board! Jeff is the greatest choice you can make for your personal home management needs
    - and I'm not just saying that because I am Jeff but also because it's true. At least that's what
    my mother says. Anyways, please clicky clicky on that linky linky so I know you're for real:
</p>
<p>
    <a href="${baseUrl}/login/?verify=${encodeURIComponent(token)}" target="_blank">Verify email address</a><br />
</p>
<p>
    In case you didn't register, shame on you. You really should. The two of us would make a great team.
    Oh, and incidentally, some troll is entering your email address on dubious (yet totally likeable) online apps.
    You should really talk to them.
</p>
<br />
<p>
    See you on the other tab,<br />
    Jeff.
</p>

`;