using System.Net;
using Flashcards_spa.Authorization;
using Flashcards_spa.Data;
using Flashcards_spa.Logging;
using Flashcards_spa.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Flashcards_spa.Controllers;

[ApiController]
[Route("api/[controller]s")]
public class CardController : ControllerBase
{
    private readonly ICardRepository _cardRepository;
    private readonly IDeckRepository _deckRepository;
    private readonly IAuthorizationService _authorizationService;
    private readonly ILogger<CardController> _logger;

    // Default title
    [ViewData] public string Title { get; set; } = "Cards";

    // Status code for error view
    [TempData] public int? ErrorCode { get; set; }

    // message for error view
    [TempData] public string? ErrorMsg { get; set; }


    public CardController(ICardRepository cardRepository, IDeckRepository deckRepository,
        IAuthorizationService authorizationService, ILogger<CardController> logger)
    {
        _cardRepository = cardRepository;
        _deckRepository = deckRepository;
        _authorizationService = authorizationService;
        _logger = logger;
    }

    [HttpGet("{cardId}")]
    public async Task<ActionResult<Card?>> GetCardById(int cardId)
    {
        try
        {
            // Get the card from database.
            var card = await _cardRepository.GetCardById(cardId);

            // Check if the card exists.
            if (card == null)
            {
                _logger.LogError(
                    "{FormatError} CardId: {cardId}",
                    ErrorHandling.FormatLog(ControllerContext, "Card not found."),
                    cardId
                );
                return NotFound();
            }

            // Check if the user is authorized to update the card.
            var authorizationResult = await _authorizationService.AuthorizeAsync(
                User, card, Operations.Read);
            if (!authorizationResult.Succeeded)
            {
                _logger.LogWarning(
                    "{FormatError} CardId: {cardId}",
                    ErrorHandling.FormatLog(ControllerContext, "Attempt for unauthorized access."),
                    cardId
                );
                return Forbid();
            }

            return card;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                "{FormatException}",
                ErrorHandling.FormatException(ControllerContext, "Internal server error.", ex)
            );
            return StatusCode(HttpStatusCode.InternalServerError.GetHashCode());
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Card requestCard)
    {
        try
        {
            // We only set the properties that the user should be able to set.
            var newCard = new Card
            {
                DeckId = requestCard.DeckId,
                Deck = await _deckRepository.GetDeckById(requestCard.DeckId),
                Front = requestCard.Front,
                Back = requestCard.Back,
            };

            if (newCard.Deck == null)
            {
                _logger.LogError(
                    "{FormatError} DeckId: {newCard.deckId}",
                    ErrorHandling.FormatLog(ControllerContext, "Deck not found."),
                    newCard.DeckId
                );

                return NotFound(); // 404, not found.
            }

            // Check if the model state is valid.
            if (!TryValidateModel(newCard))
            {
                _logger.LogWarning(
                    "{FormatError} Card: {@Card}",
                    ErrorHandling.FormatLog(ControllerContext, "Model is invalid."),
                    newCard
                );
                return BadRequest(); // Returns error 400 if the model is invalid.
            }

            // Check if the user is authorized to create a card in the deck.
            var authorizationResult = await _authorizationService.AuthorizeAsync(
                User, newCard, Operations.Create);
            if (!authorizationResult.Succeeded)
            {
                _logger.LogWarning(
                    "{FormatError} DeckId: {newCard.DeckId}",
                    ErrorHandling.FormatLog(ControllerContext, "Attempt for unauthorized creation."),
                    newCard.DeckId
                );
                return Forbid();
            }

            // Create the card.
            await _cardRepository.Create(newCard);

            return Created("", newCard);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                "{FormatException}",
                ErrorHandling.FormatException(ControllerContext, "Internal server error.", ex)
            );
            return StatusCode(HttpStatusCode.InternalServerError.GetHashCode());
        }
    }

    [HttpPut("{cardId}")]
    public async Task<IActionResult> Update(int cardId, [FromBody] Card card)
    {
        try
        {
            // Checks if the model, here being Card, is valid.
            if (!TryValidateModel(card))
            {
                _logger.LogWarning("{FormatError} Card: {@Card}",
                    ErrorHandling.FormatLog(ControllerContext, "Model is invalid."), card);
                return BadRequest("Invalid card data.");
            }

            // Get the old card.
            var oldCard = await _cardRepository.GetCardById(cardId);
            if (oldCard == null)
            {
                _logger.LogError("{FormatError} CardId: {cardId}",
                    ErrorHandling.FormatLog(ControllerContext, "Card not found."), card.CardId);

                return NotFound();
            }

            // Check if the user is authorized to update the card.
            var authorizationResult = await _authorizationService.AuthorizeAsync(
                User, oldCard, Operations.Update);
            if (!authorizationResult.Succeeded)
            {
                _logger.LogWarning("{FormatError} CardId: {cardId}",
                    ErrorHandling.FormatLog(ControllerContext, "Attempt for unauthorized update."), oldCard.CardId);
                return Forbid();
            }

            // Update the card.
            oldCard.Front = card.Front;
            oldCard.Back = card.Back;
            await _cardRepository.Update(oldCard);

            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError("{FormatException}",
                ErrorHandling.FormatException(ControllerContext, "Internal server error.", ex));
            return StatusCode(HttpStatusCode.InternalServerError.GetHashCode());
        }
    }

    // Delete card.
    [HttpDelete("{cardId}")]
    public async Task<IActionResult> Delete(int cardId)
    {
        try
        {
            var card = await _cardRepository.GetCardById(cardId);
            // Check if the card exists.
            if (card == null)
            {
                _logger.LogError(
                    "{FormatError} CardId: {cardId}",
                    ErrorHandling.FormatLog(ControllerContext, "Card not found."),
                    cardId
                );
                return NotFound();
            }

            // Check if the user is authorized to delete the card.
            var authorizationResult = await _authorizationService.AuthorizeAsync(
                User, card, Operations.Delete);
            if (!authorizationResult.Succeeded)
            {
                _logger.LogWarning(
                    "{FormatError} CardId: {cardId}",
                    ErrorHandling.FormatLog(ControllerContext, "Attempt for unauthorized delete."),
                    cardId
                );
                return Forbid();
            }

            // Delete the card.
            var result = await _cardRepository.Delete(cardId);
            // Check if the card was deleted.
            if (!result)
            {
                _logger.LogError(
                    "{FormatError} CardId: {cardId}",
                    ErrorHandling.FormatLog(ControllerContext, "Card delete failed."),
                    cardId
                );

                return BadRequest(); // 400
            }

            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError("{FormatException}",
                ErrorHandling.FormatException(ControllerContext, "Internal server error.", ex));
            return StatusCode(HttpStatusCode.InternalServerError.GetHashCode());
        }
    }
}