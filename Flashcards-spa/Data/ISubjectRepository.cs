using Flashcards_spa.Models;
namespace Flashcards_spa.Data;

public interface ISubjectRepository
{
    Task Create(Subject subject);
    Task Update(Subject subject);
    Task<bool> Delete(int id);
    Task<Subject?> GetSubjectById(int id);
    Task<IEnumerable<Subject>?> GetAllByUserId(string userId);
    Task<IEnumerable<Subject>?> GetAllPublic();
}