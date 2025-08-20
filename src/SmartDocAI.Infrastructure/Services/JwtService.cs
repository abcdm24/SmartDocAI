using DocumentFormat.OpenXml.Office2019.Presentation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using SmartDocAI.Application.Interfaces;
using SmartDocAI.Domain.Entities;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SmartDocAI.Infrastructure.Services
{
    /// <summary>
    /// JwtService contains Jwt secruity properties
    /// </summary>
    public class JwtService : IJwtService
    {
        private readonly string _secret;
        private readonly string _issuer;
        private readonly string _audience;
        private ILogger<JwtService> _logger;

        public JwtService(IConfiguration config, ILogger<JwtService> logger)
        {
            _secret = config!["JwtSettings:Secret"]!;
            _issuer = config!["JwtSettings:Issuer"]!;
            _audience = config!["JwtSettings:Audience"]!;
            _logger = logger;
        }

        public string GenerateToken(User user) {

            var claims = new[] {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email)
            };

            JwtSecurityToken token = new JwtSecurityToken(string.Empty);
            try
            {
                _logger.LogInformation($"Secret key: {_secret}");
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secret));
                //var keyBytes = Convert.FromBase64String(_secret);
                //var key = new SymmetricSecurityKey(keyBytes);
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                token = new JwtSecurityToken(
                    issuer: _issuer,
                    audience: _audience,
                    claims: claims,
                    expires: DateTime.UtcNow.AddHours(1),
                    signingCredentials: creds
                    );
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error: {ex.Message}");
                throw new Exception($"Error in token generation: {ex.Message}, key:{_secret}",ex.InnerException);
            }
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
