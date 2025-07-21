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

namespace SmartDocAI.Infrastructure.Persistence.Repositories
{
    public class MockDocumentRepository : IDocumentRepository
    {
        private static readonly ConcurrentDictionary<Guid, IDocument> _documents = new ConcurrentDictionary<Guid, IDocument>();
        private ILogger<MockDocumentRepository> _logger;

        public MockDocumentRepository(ILogger<MockDocumentRepository> logger)
        {
            _logger = logger;
        }

        public Task AddAsync(IDocument document)
        {
            _documents[document.Id] = document;
            return Task.CompletedTask;
        }

        public Task<bool> DeleteAsync(Guid id)
        {
            return Task.FromResult(_documents.TryRemove(id, out _));
        }

        public Task<IEnumerable<IDocument>> GetAllAsync()
        {
            return Task.FromResult<IEnumerable<IDocument>>(_documents.Values.ToList());
        }

        public Task<IDocument?> GetByIdAsync(Guid id)
        {
            _documents.TryGetValue(id, out var document);
            return Task.FromResult<IDocument?>(document);
        }

        public Task UpdateAsync(IDocument document)
        {
            if (_documents.ContainsKey(document.Id))
                _documents[document.Id] = document;
            return Task.CompletedTask;
        }
    }
}
