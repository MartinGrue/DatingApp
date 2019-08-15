using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DatingApp.Data;
using DatingApp.Dtos;
using DatingApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        public AuthController(IAuthRepository repo, IConfiguration config)
        {
            _repo = repo;
            _config = config;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto dto)
        {
            //validation request
            dto.Username = dto.Username.ToLower();
            if (await _repo.UserExists(dto.Username))
            {
                return BadRequest("Username alrady exists");
            }
            var userToCreate = new User
            {
                Username = dto.Username
            };
            var createdUSer = await _repo.Register(userToCreate, dto.Password);
            return StatusCode(201);
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto dto)
        {            
            var userFromrepo = await _repo.Login(dto.Username.ToLower(), dto.Password);
            if (userFromrepo == null)
            {
                return Unauthorized();
            }
            var claims = new[]{
                    new Claim(ClaimTypes.NameIdentifier, userFromrepo.Id.ToString()),
                    new Claim(ClaimTypes.Name, userFromrepo.Username)
                };

            var key = new SymmetricSecurityKey(Encoding.UTF8.
            GetBytes(_config.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokendiscriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokendiscriptor);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token)
            });
        }
    }
}