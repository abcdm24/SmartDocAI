using Microsoft.AspNetCore.Http;
using SmartDocAI.Application.DTOs;
using SmartDocAI.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
using Document = SmartDocAI.Domain.Entities.Document;

namespace SmartDocAI.Infrastructure.Services
{
    public class DocumentService : IDocumentService
    {
        private readonly IDocumentRepository _documentRepository;
        private readonly Func<string, IDocumentTextExtractor> _extractorFactory;
        public DocumentService(IDocumentRepository documentRepository, Func<string, IDocumentTextExtractor> extractorFactory)
        {
            _documentRepository = documentRepository;
            _extractorFactory = extractorFactory;
        }

        public async Task<Document> UploadDocumentAsync(Document document)
        {
            //var document = new Document
            //{
            //    Id = Guid.NewGuid(),
            //    FileName = dto.Name,
            //    Content = dto.Content,
            //    FileType = Enum.TryParse(dto.Type, out Domain.Enums.DocumentType docType) ? docType : Domain.Enums.DocumentType.Unknown
            //};

            await _documentRepository.AddAsync(document);
            return document;
        }

        public async Task<Document> UploadDocumentAsync(IFormFile file, string userName)
        {
            //var document = new Document
            //{
            //    Id = Guid.NewGuid(),
            //    FileName = dto.Name,
            //    Content = dto.Content,
            //    FileType = Enum.TryParse(dto.Type, out Domain.Enums.DocumentType docType) ? docType : Domain.Enums.DocumentType.Unknown
            //};
            string folderPath = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location)!, "Files");
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            var filePath = Path.Combine(folderPath, Guid.NewGuid() + Path.GetExtension(file.FileName));
            using (var stream = System.IO.File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }
            var extractor = _extractorFactory(filePath);
            var content = await extractor.ExtractTextAsync(filePath);
            var doc = new Document
            {
                FileName = file.FileName,
                Content = content,
                FileType = file.ContentType switch
                {
                    "application/pdf" => Domain.Enums.DocumentType.Pdf,
                    "application/msword" => Domain.Enums.DocumentType.Word,
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" => Domain.Enums.DocumentType.Word,
                    "text/plain" => Domain.Enums.DocumentType.Text,
                    _ => Domain.Enums.DocumentType.Unknown
                },
                StoragePath = filePath,
                UploadedAt = DateTime.UtcNow,
                Metadata = new Domain.ValueObjects.DocumentMetadata
                {
                    Id = Guid.NewGuid(),
                    Title = file.FileName,
                    Author = "Unknown",
                    PageCount = null,
                    FileSize = file.Length,
                    UploadedBy = userName,
                    UploadedDate = DateOnly.FromDateTime(DateTime.UtcNow)
                }
            };

            await _documentRepository.AddAsync(doc);
            return doc;
        }

        public async Task<DocumentDto?> GetDocumentByIdAsync(Guid id)
        {
            var document = await _documentRepository.GetByIdAsync(id);
            return document == null ? null : MapToDto(document);
            
        }


        public async Task<IEnumerable<DocumentDto>> GetAllDocumentsAsync()
        {
            var docs = await _documentRepository.GetAllAsync();
            return docs.Select(MapToDto);
        }

        public async Task<Guid> CreateDocumentAsync(Document document)
        {
            //var entity = new Document {
            //    Id = Guid.NewGuid(),
            //    FileName = dto.Name,
            //    Content = dto.Content,
            //    FileType = Enum.TryParse(dto.Type, out Domain.Enums.DocumentType type) ? type : Domain.Enums.DocumentType.Unknown
            //};

            await _documentRepository.AddAsync(document);
            return document.Id;
        }

        public async Task<bool> DeleteDocumentAsync(Guid id)
        {
            return await _documentRepository.DeleteAsync(id);
        }

        public async Task<bool> UpdateDocumentAsync(Guid id, Document document)
        {
            var existing = await _documentRepository.GetByIdAsync(id);
            if(existing == null)
            {
                return false;
            }

            existing.FileName = document.FileName;
            existing.Content = document.Content;
            //existing.FileType = Enum.TryParse(document.FileTypeType, out Domain.Enums.DocumentType type) ? type : Domain.Enums.DocumentType.Unknown;

            await _documentRepository.UpdateAsync(existing);
            return true;
        }

        public static DocumentDto MapToDto(Document doc) => new DocumentDto
        {
            Id = doc.Id,
            Name = doc.FileName,
            //Content = doc.Content,
            //Type = doc.FileType.ToString()
            UploadedAt = doc.UploadedAt
        };
    }
}
