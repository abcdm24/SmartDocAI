using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SmartDocAI.Application.DTOs;
using SmartDocAI.Application.Interfaces;
using SmartDocAI.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace SmartDocAI.Infrastructure.Persistence.Repositories
{
    public class DocumentRepository : IDocumentRepository
    {
        private readonly SmartDocAIDbContext _context;
        private readonly ILogger<DocumentRepository> _logger;

        public DocumentRepository(SmartDocAIDbContext context, ILogger<DocumentRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task AddAsync(IDocument document)
        {
            await _context.Documents.AddAsync(document);
            await _context.SaveChangesAsync();
        }

        public Task<IEnumerable<IDocument>> GetAllAsync()
        {
            return _context.Documents.ToListAsync<IDocument>().ContinueWith(task => task.Result.AsEnumerable());
        }

        public async Task<IDocument?> GetByIdAsync(Guid id)
        {
            return await _context.Documents.FindAsync(id);
        }

        public async Task UpdateAsync(IDocument document)
        {
            _context.Documents.Update(document);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var document = await GetByIdAsync(id);
            if (document != null)
            {
                _context.Documents.Remove(document);
                await _context.SaveChangesAsync();
            }
            else
            {
                //throw new KeyNotFoundException($"Document with ID {id} not found.");
                return false;
            }
            return true;
        }
    }
}
