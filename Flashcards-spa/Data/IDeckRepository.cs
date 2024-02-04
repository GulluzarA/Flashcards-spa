using Flashcards_spa.Models;

namespace Flashcards_spa.Data;

public interface IDeckRepository
{
    Task<Deck?> GetDeckById(int id);
    Task Create(Deck deck);
    Task Update(Deck deck);
    Task<bool> Delete(int id);
}