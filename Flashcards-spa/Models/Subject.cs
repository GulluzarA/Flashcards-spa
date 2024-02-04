using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Flashcards_spa.Models;

[JsonObject(MemberSerialization.OptIn)]
public class Subject
{
    [JsonProperty("SubjectId")] 
    public int SubjectId { get; set; }

    [JsonProperty("Name")]
    [RegularExpression(@"[0-9a-zA-ZæøåÆØÅ. \-]{3,50}",
        ErrorMessage = "The subject name must contain 3 to 50 characters.")]
    [Required]
    public string Name { get; set; } = default!;

    [JsonProperty("OwnerId")]
    public string? OwnerId { get; set; }

    [JsonProperty("Description")]
    [StringLength(150)]
    public string? Description { get; set; }

    [JsonProperty("Visibility")]
    public SubjectVisibility Visibility { get; set; } = SubjectVisibility.Private;

    [JsonProperty("Decks")]
    // navigation property
    public virtual List<Deck>? Decks { get; set; }
}

public enum SubjectVisibility
{
    Public,
    Private
}