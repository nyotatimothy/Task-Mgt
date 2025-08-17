using System.ComponentModel.DataAnnotations;
using backend.Models;

namespace backend.DTOs;

public record TaskCreateDto(
    [Required] [MaxLength(200)] string Title,
    [MaxLength(1000)] string? Description,
    [Range(1, 5)] int Priority = 3,
    int? AssigneeId = null
);

public record TaskUpdateDto(
    [MaxLength(200)] string? Title,
    [MaxLength(1000)] string? Description,
    string? Status,
    [Range(1, 5)] int? Priority,
    int? AssigneeId
);

public record TaskViewDto(
    int Id,
    string Title,
    string? Description,
    string Status,
    int Priority,
    int? AssigneeId,
    string? AssigneeName,
    int CreatorId,
    string CreatorName,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
