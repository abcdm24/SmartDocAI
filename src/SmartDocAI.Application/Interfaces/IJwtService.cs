using SmartDocAI.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDocAI.Application.Interfaces
{
    /// <summary>
    /// interface to provide Jwt Secruity properties
    /// </summary>
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
