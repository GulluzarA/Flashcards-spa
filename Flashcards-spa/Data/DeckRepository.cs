using Flashcards_spa.Models;

namespace Flashcards_spa.Data;

public class DeckRepository : IDeckRepository
{
    private readonly ApplicationDbContext _db;

    public DeckRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task Create(Deck deck)
    {
        _db.Decks.Add(deck);
        await _db.SaveChangesAsync();
    }

    public async Task<Deck?> GetDeckById(int id)
    {
        return await _db.Decks.FindAsync(id);
    }

    public async Task Update(Deck deck)
    {
        _db.Decks.Update(deck);
        await _db.SaveChangesAsync();
    }

    public async Task<bool> Delete(int id)
    {
        var deck = await _db.Decks.FindAsync(id);
        if (deck == null)
        {
            return false;
        }

        _db.Decks.Remove(deck);
        await _db.SaveChangesAsync();

        return true;
    }
}