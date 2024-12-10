using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    private readonly SessionService SessionService;

    public BasicAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        SessionService sessionService)
        : base(options, logger, encoder)
    {
        SessionService = sessionService;
    }


    #pragma warning disable CS1998
    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        string? sessionId = Request.Cookies["session"];
        if(sessionId == null)
        {
            return AuthenticateResult.Fail("Missing session cookie");
        }

        if(!SessionService.HasSession(sessionId))
        {
            return AuthenticateResult.Fail("Invalid session cookie");
        }

        var claims = new[] { new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, sessionId) };
        var identity = new System.Security.Claims.ClaimsIdentity(claims, Scheme.Name);
        var principal = new System.Security.Claims.ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);

        return AuthenticateResult.Success(ticket);
    }
    #pragma warning restore CS1998
}
