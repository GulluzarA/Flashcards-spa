using System.Security.Claims;
using Flashcards_spa.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace Flashcards_spa.Authorization;

public class CardAuthorizationHandler :
    AuthorizationHandler<OperationAuthorizationRequirement, Card>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
        OperationAuthorizationRequirement requirement,
        Card resource)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

        // switch statement based on the requirement name
        switch (requirement.Name)
        {
            case nameof(Operations.Read):
                if (userId == resource.Deck?.Subject?.OwnerId
                    || resource.Deck?.Subject?.Visibility == SubjectVisibility.Public)
                {
                    context.Succeed(requirement);
                }

                break;
            default: // Create, Update, Delete
                if (userId == resource.Deck?.Subject?.OwnerId)
                {
                    context.Succeed(requirement);
                }

                break;
        }

        return Task.CompletedTask;
    }
}