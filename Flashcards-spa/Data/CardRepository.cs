using Flashcards_spa.Models;

namespace Flashcards_spa.Data;

public class CardRepository: ICardRepository
{
    private readonly ApplicationDbContext _db;
    
    public CardRepository(ApplicationDbContext db)
    {
        _db = db;
    }
    
    public async Task Create(Card card)
    {
        _db.Cards.Add(card);
        await _db.SaveChangesAsync();
    }
    
    public async Task<Card?> GetCardById(int id)
    {
        return await _db.Cards.FindAsync(id);
    }

    
    public async Task Update(Card card)
    {
        _db.Cards.Update(card);
        await _db.SaveChangesAsync();
    }
    
    public async Task<bool> Delete(int id)
    {
        var card = await _db.Cards.FindAsync(id);
        if (card == null)
        {
            return false;
        }
        
        _db.Cards.Remove(card);
        await _db.SaveChangesAsync();
        return true;
    }
}