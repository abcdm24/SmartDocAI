using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartDocAI.Application.Interfaces;
using SmartDocAI.Domain.Entities;
using SmartDocAI.Application.DTOs;
using Moq;
using Microsoft.Extensions.Logging;
using SmartDocAI.Web.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace SmartDocAI.Tests
{
    public class DocumentsControllerTests
    {
        private readonly Mock<IDocumentService> _docServiceMock = new();
        private readonly Mock<IDocumentProcessingService> _docProcessingMock = new();
        private readonly Mock<IDocumentAIService> _docAIMock = new();
        private readonly Mock<ILogger<DocumentsController>> _loggerMock = new();

        private DocumentsController CreateController() => new
            DocumentsController(_docServiceMock.Object,
                _docProcessingMock.Object,
                _docAIMock.Object,
                _loggerMock.Object
            );

        [Fact]
        public async Task Get_ReturnsDocument_WhenFound() { 
            var docId = Guid.NewGuid();
            var document = new DocumentDto { Id= docId, 
                FileName ="samplepdf" };
            _docServiceMock
                .Setup(s => s.GetDocumentByIdAsync(docId))
                .ReturnsAsync(new DocumentDto { Id = docId, FileName ="samplepdf"});

            var controller = CreateController();
            var result = await controller.Get(docId);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(document.Id, (okResult.Value as DocumentDto)!.Id);
            Assert.Equal(document.FileName, (okResult.Value as DocumentDto)!.FileName);
           // Assert.True((document.UploadedAt - (okResult.Value as DocumentDto)!.UploadedAt).Duration() < 
           //     TimeSpan.FromMicroseconds(1000));
        }

        [Fact]
        public async Task Upload_ReturnsBadRequest_WhenNoFileProvided()
        {
            var controller = CreateController();
            var result = await controller.Upload(null!);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("No file uploaded.", badRequest.Value);
        }

        [Fact]
        public async Task ExtractText_ReturnsNotFound_WhenNoFileProvided()
        {
            var docId = Guid.NewGuid();
            _docProcessingMock.Setup(s => s.ExtractTextAsync(docId)).ReturnsAsync("");

            var controller = CreateController();
            var result = await controller.ExtractText(docId);

            var notFound = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("No text extracted from the document.", notFound.Value);
        }

        [Fact]
        public async Task Summarize_ReturnsSummary_WhenTextExists()
        { 
            var docId = Guid.NewGuid();
            _docProcessingMock.Setup(x => x.ExtractTextAsync(docId))
                .ReturnsAsync("Test content");
            _docAIMock.Setup(x => x.GenerateSummaryAsync("Test content"))
                .ReturnsAsync("Summary");

            var controller = CreateController();
            var result = await controller.Summarize(docId);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var summary = okResult.Value?.GetType().GetProperty("Summary")?.GetValue(okResult.Value, null)?.ToString();
            Assert.Equal("Summary",summary);
        }

        [Fact]
        public async Task Ask_ReturnsBadRequest_WhenUserPromptIsEmpty()
        {
            var docId = Guid.NewGuid();

            var controller = CreateController();
            var result = await controller.Ask(docId, "");

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("User prompt cannot be empty.", badRequest.Value);
        }
    }
}
