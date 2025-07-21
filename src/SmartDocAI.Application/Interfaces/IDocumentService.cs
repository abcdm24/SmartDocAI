using Microsoft.AspNetCore.Http;
using SmartDocAI.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartDocAI.Domain.Interfaces;

namespace SmartDocAI.Application.Interfaces
{
    /// <summary>
    /// Service interface for managing documents.
    /// </summary>
    public interface IDocumentService
    {
        Task<IDocument> UploadDocumentAsync(IDocument document);
        Task<IDocument> UploadDocumentAsync(IFormFile document,string userName);
        Task<DocumentDto?> GetDocumentByIdAsync(Guid id);
        Task<IEnumerable<DocumentDto>> GetAllDocumentsAsync();
        Task<Guid> CreateDocumentAsync(IDocument document);
        Task<bool> UpdateDocumentAsync(Guid id, IDocument document);
        Task<bool> DeleteDocumentAsync(Guid id);
    }
}
