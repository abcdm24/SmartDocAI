using SmartDocAI.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDocAI.Application.Interfaces
{
    /// <summary>
    /// Provides functions to manage User amangement - registration, login
    /// </summary>
    public interface IAuthService
    {
        Task<bool> RegisterAsync(string name, string email, string password);
        Task<User?> AuthenticateAsync(string email, string password);
    }
}
