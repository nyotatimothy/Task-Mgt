using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public record RegisterRequest(
    [Required] [MaxLength(50)] string Username,
    [Required] [EmailAddress] [MaxLength(100)] string Email,
    [Required] [MinLength(6)] string Password
);

public record LoginRequest(
    [Required] [EmailAddress] string Email,
    [Required] string Password
);

public record AuthResponse(
    string Token,
    string Username,
    string Role
);
