using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
using SmartDocAI.Domain.Entities;
using SmartDocAI.Domain;
using SmartDocAI.Domain.Interfaces;
using Document = SmartDocAI.Domain.Entities.Document;
namespace SmartDocAI.Application.Interfaces
{
    /// <summary>
    /// Repository interface for managing documents in the application.
    /// </summary>
    public interface IDocumentRepository
    {
        Task<Document?> GetByIdAsync(Guid id);
        Task<IEnumerable<Document>> GetAllAsync();
        Task AddAsync(Document document);
        Task UpdateAsync(Document document);
        Task<bool> DeleteAsync(Guid id);
    }
}
