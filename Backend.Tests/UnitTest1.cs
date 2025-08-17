using Xunit;
using TaskStatus = backend.Models.TaskStatus;
using TaskService = backend.Services.TaskService;

namespace Backend.Tests;

public class TaskServiceTests
{
    [Theory]
    [InlineData(TaskStatus.Todo, TaskStatus.Todo, true)]           // Same to same
    [InlineData(TaskStatus.InProgress, TaskStatus.InProgress, true)] // Same to same
    [InlineData(TaskStatus.Done, TaskStatus.Done, true)]          // Same to same
    [InlineData(TaskStatus.Todo, TaskStatus.InProgress, true)]    // Valid forward
    [InlineData(TaskStatus.InProgress, TaskStatus.Done, true)]    // Valid forward
    public void IsValidStatusTransition_ValidTransitions_ReturnsTrue(TaskStatus from, TaskStatus to, bool expected)
    {
        // Act
        var result = TaskService.IsValidStatusTransition(from, to);

        // Assert
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData(TaskStatus.InProgress, TaskStatus.Todo, false)]   // Backward not allowed
    [InlineData(TaskStatus.Done, TaskStatus.Todo, false)]        // Backward not allowed
    [InlineData(TaskStatus.Done, TaskStatus.InProgress, false)]  // Backward not allowed
    [InlineData(TaskStatus.Todo, TaskStatus.Done, false)]        // Skip not allowed
    public void IsValidStatusTransition_InvalidTransitions_ReturnsFalse(TaskStatus from, TaskStatus to, bool expected)
    {
        // Act
        var result = TaskService.IsValidStatusTransition(from, to);

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void IsValidStatusTransition_ValidWorkflow()
    {
        // Test the complete happy path workflow
        Assert.True(TaskService.IsValidStatusTransition(TaskStatus.Todo, TaskStatus.InProgress));
        Assert.True(TaskService.IsValidStatusTransition(TaskStatus.InProgress, TaskStatus.Done));
    }
}