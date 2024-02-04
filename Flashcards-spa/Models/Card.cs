using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Flashcards_spa.Models;

[JsonObject(MemberSerialization.OptIn)]
public class Card
{
    [JsonProperty("CardId")]
    public int CardId { get; set; }
    
    [RegularExpression(@"[0-9a-zA-ZæøåÆØÅ.  \-]{2,120}"),
     Display(Name = "Card front ")]
    [JsonProperty("Front")]
    [Required]
    public string Front { get; set; } = string.Empty;
    
    [RegularExpression(@"[0-9a-zA-ZæøåÆØÅ.  \-]{2,120}"),
     Display(Name = "Card back")]
    [JsonProperty("Back")]
    [Required]
    public string Back { get; set; } = string.Empty;
    
    // navigation property
    public virtual Deck? Deck { get; set; }
    
    [JsonProperty("DeckId")]
    public int DeckId { get; set; }
}