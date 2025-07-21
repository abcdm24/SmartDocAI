using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SmartDocAI.Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartDocAI.Infrastructure.Persistence.Repositories;
using SmartDocAI.Application.Interfaces;
using SmartDocAI.Infrastructure.Services;
using Microsoft.Extensions.Options;


namespace SmartDocAI.Infrastructure.Configuration
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddDbContext<SmartDocAIDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));


            services.AddScoped<IDocumentRepository, DocumentRepository>();
            //services.AddScoped<IDocumentRepository, MockDocumentRepository>();
            services.AddScoped<IDocumentService, DocumentService>();
            services.AddScoped<IDocumentProcessingService, DocumentProcessingService>();
            
            services.AddTransient<PdfTextExtractor>();
            services.AddTransient<WordTextExtractor>();

            //Factory for choosing extractor based on file type
            services.AddTransient<Func<string, IDocumentTextExtractor>>(provider =>
                filePath => { 
                    var ext = Path.GetExtension(filePath).ToLowerInvariant();
                    return ext switch
                    {
                        ".pdf" => provider.GetRequiredService<PdfTextExtractor>(),
                        ".docx" => provider.GetRequiredService<WordTextExtractor>(),
                        _ => throw new NotSupportedException($"File type '{ext}' is not supported.")
                    };
                }
            );

            services.Configure<OpenAIOptions>(configuration.GetSection("OpenAI"));

            //services.AddOptions<OpenAIOptions>()
            //    .Bind(configuration.GetSection("OpenAI"));

            services.AddSingleton<IDocumentAIService, DocumentAIService>();


            return services;
        }
    }
}
