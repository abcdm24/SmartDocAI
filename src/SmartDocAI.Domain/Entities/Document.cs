using SmartDocAI.Domain.Enums;
using SmartDocAI.Domain.Interfaces;
using SmartDocAI.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDocAI.Domain.Entities
{
    public class Document //: IDocument
    {
        public Guid Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DocumentType FileType { get; set; }
        public string StoragePath { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public DocumentMetadata Metadata { get; set; } = new();
    }
}
