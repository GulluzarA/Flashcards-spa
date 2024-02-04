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
public class DeckController : ControllerBase
{
    private readonly IDeckRepository _deckRepository;
    private readonly ISubjectRepository _subjectRepository;
    private readonly IAuthorizationService _authorizationService;
    private readonly ILogger<SubjectController> _logger;

    public DeckController(IDeckRepository deckRepository,
        IAuthorizationService authorizationService,
        ILogger<SubjectController> logger,
        ISubjectRepository subjectRepository)
    {
        _deckRepository = deckRepository;
        _authorizationService = authorizationService;
        _logger = logger;
        _subjectRepository = subjectRepository;
    }

    [HttpGet("{deckId:int}")]
    public async Task<IActionResult> GetDeckById(int deckId)
    {
        try
        {
            // Get the deck
            var deck = await _deckRepository.GetDeckById(deckId);

            // Check if the deck exists
            if (deck == null)
            {
                _logger.LogError("{FormatError} DeckId: {DeckId}",
                    ErrorHandling.FormatLog(ControllerContext, "Deck not found."), deckId);
                return NotFound();
            }

            // Check if the user is authorized to view the deck
            var authorizationResult = await _authorizationService.AuthorizeAsync(
                User, deck, Operations.Read);

            if (!authorizationResult.Succeeded)
            {
                _logger.LogWarning("{FormatError} DeckId: {DeckId}",
                    ErrorHandling.FormatLog(ControllerContext, "Attempt for unauthorized access."), deckId);
                return Forbid();
            }

            return Ok(deck);
        }
        catch (Exception ex)
        {
            _logger.LogError("{FormatException}",
                ErrorHandling.FormatException(ControllerContext, "Internal server error.", ex));
            return StatusCode(HttpStatusCode.InternalServerError.GetHashCode());
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Deck requestDeck)
    {
        try
        {
            // We only set the properties that the user should be able to set
            var newDeck = new Deck
            {
                SubjectId = requestDeck.SubjectId,
                Subject = await _subjectRepository.GetSubjectById(requestDeck.SubjectId),
                Name = requestDeck.Name,
                Description = requestDeck.Description,
            };

            // Check if the subject exists
            if (newDeck.Subject == null)
            {
                _logger.LogError("{FormatError} SubjectId: {SubjectId}",
                    ErrorHandling.FormatLog(ControllerContext, "Subject not found."), newDeck.SubjectId);

                return NotFound();
            }

            // Check modelState of the subject
            if (!TryValidateModel(newDeck))
            {
                _logger.LogWarning("{FormatError} Subject: {@Subject}",
                    ErrorHandling.FormatLog(ControllerContext, "Model is invalid."), newDeck);
                // return Results.BadRequest();
                return BadRequest();
            }

            // Check if the user is authorized to create a deck for the subject
            var authorizationResult = await _authorizationService.AuthorizeAsync(
                User, newDeck.Subject, Operations.Create);
            if (!authorizationResult.Succeeded)
            {
                _logger.LogWarning("{FormatError} SubjectId: {SubjectId}",
                    ErrorHandling.FormatLog(ControllerContext, "Attempt for unauthorized creation."),
                    newDeck.SubjectId);
                return Forbid();
            }

            // Create the subject
            await _deckRepository.Create(newDeck);

            return Created("null", newDeck);
        }
        catch (Exception ex)
        {
            _logger.LogError("{FormatException}",
                ErrorHandling.FormatException(ControllerContext, "Internal server error.", ex));
            // Return internal server error
            return StatusCode(HttpStatusCode.InternalServerError.GetHashCode());
        }
    }

    [HttpPut("{deckId:int}")]
    public async Task<IActionResult> Update(int deckId, [FromBody] Deck requestDeck)
    {
        try
        {
            // Get the old deck from database
            var oldDeck = await _deckRepository.GetDeckById(deckId);

            if (oldDeck == null)
            {
                _logger.LogError("{FormatError} DeckId: {deckId}",
                    ErrorHandling.FormatLog(ControllerContext, "Deck not found."), deckId);
                return NotFound();
            }

            // Check if the user is authorized to update the deck
            var authorizationResult = await _authorizationService.AuthorizeAsync(
                User, oldDeck, Operations.Update);
            if (!authorizationResult.Succeeded)
            {
                _logger.LogWarning("{FormatError} DeckId: {DeckId}",
                    ErrorHandling.FormatLog(ControllerContext, "Attempt for unauthorized update."), deckId);
                return Forbid();
            }

            // We only set the properties that the user should be able to set
            oldDeck.Name = requestDeck.Name;
            oldDeck.Description = requestDeck.Description;

            // Check modelState of the deck
            if (!TryValidateModel(oldDeck))
            {
                _logger.LogWarning("{FormatError} Deck: {@Deck}",
                    ErrorHandling.FormatLog(ControllerContext, "Model is invalid."), requestDeck);
                return BadRequest("Invalid deck data");
            }

            //Update the deck
            await _deckRepository.Update(oldDeck);

            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError("{FormatException}",
                ErrorHandling.FormatException(ControllerContext, "Internal server error.", ex));
            //Return internal server error
            return StatusCode(500);
        }
    }

    [HttpDelete("{deckId:int}")]
    public async Task<IActionResult> Delete(int deckId)
    {
        try
        {
            // Get the deck from database
            var deck = await _deckRepository.GetDeckById(deckId);

            // Check if the deck exists
            if (deck == null)
            {
                _logger.LogError("{FormatError} DeckId: {DeckId}",
                    ErrorHandling.FormatLog(ControllerContext, "Deck not found."), deckId);
                return NotFound();
            }

            // Check if the user is authorized to delete the deck
            var authorizationResult = await _authorizationService.AuthorizeAsync(
                User, deck, Operations.Delete);
            if (!authorizationResult.Succeeded)
            {
                _logger.LogWarning("{FormatError} DeckId: {DeckId}",
                    ErrorHandling.FormatLog(ControllerContext, "Attempt for unauthorized delete."), deckId);
                return Forbid();
            }

            // Delete the deck
            var result = await _deckRepository.Delete(deckId);

            // Check if the deck was deleted
            if (!result)
            {
                _logger.LogError("{FormatError} DeckId: {DeckId}",
                    ErrorHandling.FormatLog(ControllerContext, "Deck delete failed."), deckId);
                return BadRequest(HttpStatusCode.InternalServerError.GetHashCode());
            }

            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError("{FormatException}",
                ErrorHandling.FormatException(ControllerContext, "Internal server error.", ex));
            return StatusCode(500);
        }
    }
}