using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Duende.IdentityServer.EntityFramework.Options;
using Flashcards_spa.Models;

namespace Flashcards_spa.Data;

public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IOptions<OperationalStoreOptions> operationalStoreOptions)
        : base(options, operationalStoreOptions)
    {
    }
    
    public DbSet<Subject> Subjects { get; set; } = default!;
    public DbSet<Deck> Decks { get; set; } = default!;
    public DbSet<Card> Cards { get; set; } = default!;
    public DbSet<Session> Sessions { get; set; } = default!;
    public DbSet<CardResult> CardResults { get; set; } = default!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseLazyLoadingProxies();
    }
}
