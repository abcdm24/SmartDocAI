using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDocAI.Application.DTOs
{
    public struct UserDto
    {
        public string Email { get; set; }
        public string Name { get; set; }

        public override string ToString()
        {
            return $"Name:{Name}, Email:{Email}";
        }
    }
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        //public string Email { get; set; } = string.Empty;
        //public string Name { get; set; } = string.Empty;
        public UserDto User { get; set; } = new UserDto();
    }
}
