using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Flashcards_spa.Models;

[JsonObject(MemberSerialization.OptIn)]
public class Deck
{
    [JsonProperty("DeckId")] public int DeckId { get; set; }

    [JsonProperty("Name")]
    [RegularExpression(@"[0-9a-zA-ZæøåÆØÅ. \-]{3,50}"),
     Display(Name = "Deck title")]
    [Required]
    public string Name { get; set; } = default!;

    [StringLength(150)]
    [JsonProperty("Description")]
    public string? Description { get; set; }

    // navigation property
    public virtual Subject? Subject { get; set; }
    [JsonProperty("SubjectId")] public int SubjectId { get; set; }

    [JsonProperty("Cards")]
    // navigation property
    public virtual List<Card>? Cards { get; set; }
}