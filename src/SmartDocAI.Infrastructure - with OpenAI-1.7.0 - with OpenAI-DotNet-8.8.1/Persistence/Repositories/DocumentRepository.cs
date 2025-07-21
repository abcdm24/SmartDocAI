using Microsoft.EntityFrameworkCore;
using SmartDocAI.Application.DTOs;
using SmartDocAI.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
using Document = SmartDocAI.Domain.Entities.Document;

namespace SmartDocAI.Infrastructure.Persistence.Repositories
{
    public class DocumentRepository : IDocumentRepository
    {
        private readonly SmartDocAIDbContext _context;

        public DocumentRepository(SmartDocAIDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Document document)
        {
            await _context.Documents.AddAsync(document);
            await _context.SaveChangesAsync();
        }

        public Task<IEnumerable<Document>> GetAllAsync()
        {
            return _context.Documents.ToListAsync<Document>().ContinueWith(task => task.Result.AsEnumerable());
        }

        public async Task<Document?> GetByIdAsync(Guid id)
        {
            return await _context.Documents.FindAsync(id);
        }

        public async Task UpdateAsync(Document document)
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
