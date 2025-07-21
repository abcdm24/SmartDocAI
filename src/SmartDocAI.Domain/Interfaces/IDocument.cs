using SmartDocAI.Domain.Enums;
using SmartDocAI.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDocAI.Domain.Interfaces
{
    public interface IDocument
    {
        Guid Id { get; set; }
        string FileName { get; set; }
        string Content { get; set; }
        DocumentType FileType { get; set; }
        string StoragePath { get; set; }
        DateTime UploadedAt { get; set; }
        DocumentMetadata Metadata { get; set; }
    }
}
