using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SmartDocAI.Application.DTOs;
using SmartDocAI.Application.Interfaces;
using SmartDocAI.Domain.Entities;
using SmartDocAI.Infrastructure.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SmartDocAI.Web.Controllers
{
    /// <summary>
    /// Controller for user registration and login
    /// </summary>
    [ApiController]
    [Route("api/[Controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;
        private readonly IAuthService _authService;
        private readonly IJwtService _jwtService;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="authService"></param>
        /// <param name="jwtService"></param>
        /// <param name="logger"></param>
        public AuthController(IAuthService authService, IJwtService jwtService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _jwtService = jwtService;
            _logger = logger;
        }

        /// <summary>
        /// function to test the API
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet("ShowVal/{name}")]
        public IActionResult GetValue(string name)
        {
            return Ok(new { val = "Hello " + name });
        }

        /// <summary>
        /// Register new user for SmartDocAI
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("register")]
        public async Task<IActionResult> Register(AuthRequestDto request)
        {
            var success = await _authService.RegisterAsync(request.Name, request.Email, request.Password);
            if (!success) return BadRequest("Email already exists");
            return Ok("User registered successfully");
        }

        /// <summary>
        /// Login for SmartDocAI user
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(AuthRequestDto request)
        {
            var user = await _authService.AuthenticateAsync(request.Email, request.Password);
            if (user == null) return BadRequest("Invalid credentials");

            try
            {
                _logger.LogInformation($"User found in DB: {user.Name}");

                var token = _jwtService.GenerateToken(user);
                var responseDto = new AuthResponseDto
                {
                    Token = token,
                    User = new UserDto { Email = user.Email, Name = user.Name }
                };


                return await Task.FromResult(Ok(responseDto));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in token generation: {ex.Message}");
                _logger.LogError($"Error in token generation: {ex.InnerException}");
                return BadRequest(ex.Message);
            }
        }



    }
}
