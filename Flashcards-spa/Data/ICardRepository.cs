using Flashcards_spa.Models;

namespace Flashcards_spa.Data;

public interface ICardRepository
{
    Task<Card?> GetCardById(int id);
    Task Create(Card card);
    Task Update(Card card);
    Task<bool> Delete(int id);
}