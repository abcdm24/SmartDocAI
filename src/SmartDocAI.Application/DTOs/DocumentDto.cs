using Document = SmartDocAI.Domain.Entities.Document;
using SmartDocAI.Domain.Enums;
using SmartDocAI.Domain.Interfaces;
using SmartDocAI.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDocAI.Application.DTOs
{
    public class DocumentDto : IDocument
    {
        public Guid Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DocumentType FileType { get; set; }
        public string StoragePath { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public DocumentMetadata Metadata { get; set; } = new();

        /// <summary>
        /// default constructor
        /// </summary>
        public DocumentDto() { 
        }

        /// <summary>
        /// constructor that takes Document object
        /// </summary>
        /// <param name="doc"></param>
        public DocumentDto(Document doc) { 
            Id = doc.Id;
            FileName = doc.FileName;
            Content = doc.Content;
            FileType = doc.FileType;
            StoragePath = doc.StoragePath;
            UploadedAt = doc.UploadedAt;
            Metadata = doc.Metadata;
        }
    }
}
