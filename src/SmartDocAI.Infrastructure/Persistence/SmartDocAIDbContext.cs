using Microsoft.EntityFrameworkCore;
using SmartDocAI.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDocAI.Infrastructure.Persistence
{
    public class SmartDocAIDbContext : DbContext
    {
        public SmartDocAIDbContext(DbContextOptions<SmartDocAIDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Add any additional model configurations here
        }

        public DbSet<IDocument> Documents  => Set<IDocument>();
    }
}
