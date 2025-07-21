using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
using SmartDocAI.Domain.Entities;
using SmartDocAI.Domain;
using SmartDocAI.Domain.Interfaces;

namespace SmartDocAI.Application.Interfaces
{
    /// <summary>
    /// Repository interface for managing documents in the application.
    /// </summary>
    public interface IDocumentRepository
    {
        Task<IDocument?> GetByIdAsync(Guid id);
        Task<IEnumerable<IDocument>> GetAllAsync();
        Task AddAsync(IDocument document);
        Task UpdateAsync(IDocument document);
        Task<bool> DeleteAsync(Guid id);
    }
}
