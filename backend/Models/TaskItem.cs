using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class TaskItem
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    [Required]
    public TaskStatus Status { get; set; } = TaskStatus.Todo;
    
    [Range(1, 5)]
    public int Priority { get; set; } = 3;
    
    public int? AssigneeId { get; set; }
    
    [Required]
    public int CreatorId { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    [ForeignKey(nameof(AssigneeId))]
    public User? Assignee { get; set; }
    
    [ForeignKey(nameof(CreatorId))]
    public User Creator { get; set; } = null!;
}

public enum TaskStatus
{
    Todo,
    InProgress,
    Done
}
