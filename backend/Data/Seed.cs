using Microsoft.AspNetCore.Identity;
using backend.Models;

namespace backend.Data;

public static class Seed
{
    public static async Task SeedDataAsync(AppDbContext context, IPasswordHasher<User> passwordHasher)
    {
        // Only seed if no users exist
        if (context.Users.Any())
            return;

        // Create admin user
        var admin = new User
        {
            Username = "admin",
            Email = "admin@example.com",
            Role = UserRole.ADMIN
        };
        admin.PasswordHash = passwordHasher.HashPassword(admin, "Admin123!");

        // Create regular user
        var user = new User
        {
            Username = "user",
            Email = "user@example.com",
            Role = UserRole.USER
        };
        user.PasswordHash = passwordHasher.HashPassword(user, "User123!");

        context.Users.AddRange(admin, user);
        await context.SaveChangesAsync();

        // Create sample tasks
        var tasks = new[]
        {
            new TaskItem
            {
                Title = "Setup project repository",
                Description = "Initialize Git repository and create basic project structure",
                Status = backend.Models.TaskStatus.Done,
                Priority = 5,
                CreatorId = admin.Id,
                AssigneeId = admin.Id
            },
            new TaskItem
            {
                Title = "Design database schema",
                Description = "Create entity models and database migrations for the task management system",
                Status = backend.Models.TaskStatus.Done,
                Priority = 4,
                CreatorId = admin.Id,
                AssigneeId = user.Id
            },
            new TaskItem
            {
                Title = "Implement authentication",
                Description = "Add JWT-based authentication with user registration and login",
                Status = backend.Models.TaskStatus.InProgress,
                Priority = 5,
                CreatorId = admin.Id,
                AssigneeId = user.Id
            },
            new TaskItem
            {
                Title = "Create task CRUD endpoints",
                Description = "Build REST API endpoints for creating, reading, updating, and deleting tasks",
                Status = backend.Models.TaskStatus.InProgress,
                Priority = 4,
                CreatorId = user.Id,
                AssigneeId = user.Id
            },
            new TaskItem
            {
                Title = "Add task status transitions",
                Description = "Implement business rules for valid task status changes (Todo → InProgress → Done)",
                Status = backend.Models.TaskStatus.Todo,
                Priority = 3,
                CreatorId = user.Id,
                AssigneeId = null
            },
            new TaskItem
            {
                Title = "Build React frontend",
                Description = "Create React components for task management interface with 3-column board layout",
                Status = backend.Models.TaskStatus.Todo,
                Priority = 3,
                CreatorId = admin.Id,
                AssigneeId = null
            }
        };

        context.Tasks.AddRange(tasks);
        await context.SaveChangesAsync();
    }
}
