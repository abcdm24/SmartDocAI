using Microsoft.Extensions.Logging;
using SmartDocAI.Application.Interfaces;
using SmartDocAI.Domain.Entities;
using SmartDocAI.Domain.Interfaces;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Document = SmartDocAI.Domain.Entities.Document;

namespace SmartDocAI.Infrastructure.Persistence.Repositories
{
    public class MockDocumentRepository : IDocumentRepository
    {
        private static readonly ConcurrentDictionary<Guid, Document> _documents = new ConcurrentDictionary<Guid, Document>();
        private ILogger<MockDocumentRepository> _logger;

        public MockDocumentRepository(ILogger<MockDocumentRepository> logger)
        {
            _logger = logger;
        }

        public Task AddAsync(Document document)
        {
            _documents[document.Id] = document;
            return Task.CompletedTask;
        }

        public Task<bool> DeleteAsync(Guid id)
        {
            return Task.FromResult(_documents.TryRemove(id, out _));
        }

        public Task<IEnumerable<Document>> GetAllAsync()
        {
            return Task.FromResult<IEnumerable<Document>>(_documents.Values.ToList());
        }

        public Task<Document?> GetByIdAsync(Guid id)
        {
            _documents.TryGetValue(id, out var document);
            return Task.FromResult<Document?>(document);
        }

        public Task UpdateAsync(Document document)
        {
            if (_documents.ContainsKey(document.Id))
                _documents[document.Id] = document;
            return Task.CompletedTask;
        }
    }
}
