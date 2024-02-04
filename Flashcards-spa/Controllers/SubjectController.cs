using System.Net;
using System.Security.Claims;
using Flashcards_spa.Authorization;
using Flashcards_spa.Data;
using Flashcards_spa.Logging;
using Flashcards_spa.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Flashcards_spa.Controllers;

// [Authorize]
[ApiController]
[Route("api/[controller]s")]
public class SubjectController : ControllerBase
{
    private readonly ISubjectRepository _subjectRepository;
    private readonly IAuthorizationService _authorizationService;
    private readonly ILogger<SubjectController> _logger;

    public SubjectController(ISubjectRepository subjectRepository,
        IAuthorizationService authorizationService, ILogger<SubjectController> logger)
    {
        _subjectRepository = subjectRepository;
        _authorizationService = authorizationService;
        _logger = logger;
    }

    [HttpGet("private")]
    public async Task<ActionResult<IEnumerable<Subject>?>> GetPrivateSubjects()
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId != null)
            {
                var subjects = await _subjectRepository.GetAllByUserId(userId);
                return Ok(subjects);
            }

            // User not found
            _logger.LogError("{FormatError}",
                ErrorHandling.FormatLog(ControllerContext, "User not found."));

            return NotFound();
        }
        catch (Exception ex)
        {
            // Server error
            _logger.LogError("{FormatException}",
                ErrorHandling.FormatException(ControllerContext, "Internal server error.", ex));
            return StatusCode(HttpStatusCode.InternalServerError.GetHashCode());
        }
    }

    [HttpGet("public")]
    public async Task<ActionResult<IEnumerable<Subject>?>> GetPublicSubjects()
    {
        try
        {
            var subjects = await _subjectRepository.GetAllPublic();
            return Ok(subjects);
        }
        catch (Exception ex)
        {
            // Server error
            _logger.LogError("{FormatException}",
                ErrorHandling.FormatException(ControllerContext, "Internal server error.", ex));
            return StatusCode(HttpStatusCode.InternalServerError.GetHashCode());
        }
    }

    [HttpGet("{subjectId}")]
    public async Task<ActionResult<Subject?>> GetSubjectById(int subjectId)
    {
        try
        {
            // Get the subject from database
            var subject = await _subjectRepository.GetSubjectById(subjectId);

            // Check if the subject exists
            if (subject == null)
            {
                _logger.LogError("{FormatError} SubjectId: {SubjectId}",
                    ErrorHandling.FormatLog(ControllerContext, "subject not found."), subjectId);
                return NotFound();
            }

            // Check if the user is authorized to get the subject
            var authorizationResult = await _authorizationService.AuthorizeAsync(
                User, subject, Operations.Read);
            if (!authorizationResult.Succeeded)
            {
                _logger.LogWarning("{FormatError} SubjectId: {SubjectId}",
                    ErrorHandling.FormatLog(ControllerContext, "Attempt for unauthorized access."), subjectId);
                return Forbid();
            }

            return subject;
        }
        catch (Exception ex)
        {
            _logger.LogError("{FormatException}",
                ErrorHandling.FormatException(ControllerContext, "Internal server error.", ex));
            return StatusCode(HttpStatusCode.InternalServerError.GetHashCode());
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Subject requestSubject)
    {
        try
        {
            // We only set the properties that the user should be able to set
            var newSubject = new Subject
            {
                Name = requestSubject.Name,
                Description = requestSubject.Description,
                Visibility = requestSubject.Visibility,
                OwnerId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            };

            // Check modelState of the subject
            if (!TryValidateModel(newSubject))
            {
                _logger.LogWarning("{FormatError} Subject: {@Subject}",
                    ErrorHandling.FormatLog(ControllerContext, "Model is invalid."), newSubject);
                // return Results.BadRequest();
                return BadRequest();
            }

            // Check if the user exists
            if (newSubject.OwnerId == null)
            {
                _logger.LogError("{FormatError}",
                    ErrorHandling.FormatLog(ControllerContext, "User not found, creation failed."));

                return NotFound();
            }

            // Create the subject
            await _subjectRepository.Create(newSubject);


            return Created("null", newSubject);
        }
        catch (Exception ex)
        {
            _logger.LogError("{FormatException}",
                ErrorHandling.FormatException(ControllerContext, "Internal server error.", ex));
            // Return internal server error
            return StatusCode(HttpStatusCode.InternalServerError.GetHashCode());
        }
    }

    [HttpDelete("{subjectId:int}")]
    public async Task<IActionResult> Delete(int subjectId)
    {
        try
        {
            // Get the subject from database
            var subject = await _subjectRepository.GetSubjectById(subjectId);

            // Check if the subject exists
            if (subject == null)
            {
                _logger.LogError("{FormatError} SubjectId: {subjectId}",
                    ErrorHandling.FormatLog(ControllerContext, "Subject not found."), subjectId);
                return NotFound();
            }

            // Check if the user is authorized to delete the subject
            var authorizationResult = await _authorizationService.AuthorizeAsync(
                User, subject, Operations.Delete);
            if (!authorizationResult.Succeeded)
            {
                _logger.LogWarning("{FormatError} SubjectId: {subjectId}",
                    ErrorHandling.FormatLog(ControllerContext, "Attempt for unauthorized delete."), subjectId);
                return Forbid();
            }

            // Delete the subject
            var result = await _subjectRepository.Delete(subjectId);

            // Check if the subject was deleted
            if (!result)
            {
                _logger.LogError("{FormatError} SubjectId: {subjectId}",
                    ErrorHandling.FormatLog(ControllerContext, "Subject delete failed."), subjectId);

                return StatusCode(HttpStatusCode.InternalServerError.GetHashCode());
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

    [HttpPut("{subjectId:int}")]
    public async Task<IActionResult> Update(int subjectId, [FromBody] Subject requestSubject)
    {
        try
        {
            // Get the subject from database
            var subject = await _subjectRepository.GetSubjectById(subjectId);

            // Check if the subject exists
            if (subject == null)
            {
                _logger.LogError("{FormatError} SubjectId: {subjectId}",
                    ErrorHandling.FormatLog(ControllerContext, "Subject not found."), subjectId);
                return NotFound();
            }

            // Check if the user is authorized to update the subject
            var authorizationResult = await _authorizationService.AuthorizeAsync(
                User, subject, Operations.Update);
            if (!authorizationResult.Succeeded)
            {
                _logger.LogWarning("{FormatError} SubjectId: {subjectId}",
                    ErrorHandling.FormatLog(ControllerContext, "Attempt for unauthorized update."), subjectId);
                return Forbid();
            }

            // We only set the properties that the user should be able to set
            subject.Name = requestSubject.Name;
            subject.Description = requestSubject.Description;
            subject.Visibility = requestSubject.Visibility;

            // Check modelState of the subject
            if (!TryValidateModel(subject))
            {
                _logger.LogWarning("{FormatError} Subject: {@Subject}",
                    ErrorHandling.FormatLog(ControllerContext, "Model is invalid."), subject);
                return BadRequest("Invalid subject data");
            }

            // Update the subject
            await _subjectRepository.Update(subject);

            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError("{FormatException}",
                ErrorHandling.FormatException(ControllerContext, "Internal server error.", ex));
            // Return internal server error
            return StatusCode(500);
        }
    }
}