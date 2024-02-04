using System.Net;
using Flashcards_spa.Controllers;
using Flashcards_spa.Data;
using Flashcards_spa.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.Extensions.Logging;
using Moq;

namespace XunitTestProjectFlashcards_spa.Controllers;

public class SubjectControllerTests
{
    [Fact]
    public async Task GetPublicOk()
    {
        var mockSubjectRepository = new Mock<ISubjectRepository>();
        // add some subjects to the list
        mockSubjectRepository.Setup(repo => repo.GetAllPublic()).ReturnsAsync(new List<Subject>()
        {
            new Subject()
            {
                SubjectId = 1,
                Name = "Subject 1",
                Description = "Description 1",
                Visibility = SubjectVisibility.Private,
                OwnerId = "1"
            },
            new Subject()
            {
                SubjectId = 2,
                Name = "Subject 2",
                Description = "Description 2",
                Visibility = SubjectVisibility.Public,
                OwnerId = "2"
            }
        });
        var mockAuthorizationService = new Mock<IAuthorizationService>();

        var mockLogger = new Mock<ILogger<SubjectController>>();
        var subjectController = new SubjectController(mockSubjectRepository.Object, mockAuthorizationService.Object,
            mockLogger.Object);

        var controllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext(),
            ActionDescriptor = new ControllerActionDescriptor()
        };
        subjectController.ControllerContext = controllerContext;

        //act
        var result = await subjectController.GetPublicSubjects();

        //assert
        var okObjectResult = Assert.IsType<OkObjectResult>(result.Result);
        var subjects = Assert.IsAssignableFrom<IEnumerable<Subject>>(okObjectResult.Value);
        Assert.NotNull(subjects);
    }

    [Fact]
    public async Task GetPublicNotOk()
    {
        var mockSubjectRepository = new Mock<ISubjectRepository>();
        mockSubjectRepository.Setup(repo => repo.GetAllPublic())
            .ReturnsAsync(() => throw new Exception("Simulating failed database operation"));

        var mockAuthorizationService = new Mock<IAuthorizationService>();
        var mockLogger = new Mock<ILogger<SubjectController>>();
        var subjectController = new SubjectController(mockSubjectRepository.Object, mockAuthorizationService.Object,
            mockLogger.Object);

        var controllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext(),
            ActionDescriptor = new ControllerActionDescriptor()
        };
        subjectController.ControllerContext = controllerContext;

        //act
        var result = await subjectController.GetPublicSubjects();

        //assert status code 500
        var statusCodeResult = Assert.IsType<StatusCodeResult>(result.Result);
        Assert.Equal(HttpStatusCode.InternalServerError.GetHashCode(), statusCodeResult.StatusCode);
    }
}