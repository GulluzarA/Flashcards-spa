using System.Security.Claims;
using Flashcards_spa.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace Flashcards_spa.Authorization;

public class DeckAuthorizationHandler :
    AuthorizationHandler<OperationAuthorizationRequirement, Deck>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
        OperationAuthorizationRequirement requirement,
        Deck resource)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

        // switch statement based on the requirement name
        switch (requirement.Name)
        {
            case nameof(Operations.Read):
                if (userId == resource.Subject?.OwnerId
                    || resource.Subject?.Visibility == SubjectVisibility.Public)
                {
                    context.Succeed(requirement);
                }

                break;
            default: // Create, Update, Delete
                if (userId == resource.Subject?.OwnerId)
                {
                    context.Succeed(requirement);
                }

                break;
        }

        return Task.CompletedTask;
    }
}