using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;

namespace backend.Services;

public interface ITaskService
{
    Task<IEnumerable<TaskViewDto>> GetTasksAsync(string? status = null, int? assigneeId = null);
    Task<TaskViewDto?> GetTaskByIdAsync(int id);
    Task<TaskViewDto> CreateTaskAsync(int creatorId, TaskCreateDto dto);
    Task<TaskViewDto?> UpdateTaskAsync(int id, int callerId, string callerRole, TaskUpdateDto dto);
    Task<bool> DeleteTaskAsync(int id, int callerId, string callerRole);
}

public class TaskService : ITaskService
{
    private readonly AppDbContext _context;

    public TaskService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TaskViewDto>> GetTasksAsync(string? status = null, int? assigneeId = null)
    {
        var query = _context.Tasks
            .Include(t => t.Creator)
            .Include(t => t.Assignee)
            .AsQueryable();

        // Filter by status if provided
        if (!string.IsNullOrEmpty(status) && Enum.TryParse<backend.Models.TaskStatus>(status, true, out var statusEnum))
        {
            query = query.Where(t => t.Status == statusEnum);
        }

        // Filter by assignee if provided
        if (assigneeId.HasValue)
        {
            query = query.Where(t => t.AssigneeId == assigneeId.Value);
        }

        var tasks = await query.OrderByDescending(t => t.CreatedAt).ToListAsync();

        return tasks.Select(MapToViewDto);
    }

    public async Task<TaskViewDto?> GetTaskByIdAsync(int id)
    {
        var task = await _context.Tasks
            .Include(t => t.Creator)
            .Include(t => t.Assignee)
            .FirstOrDefaultAsync(t => t.Id == id);

        return task == null ? null : MapToViewDto(task);
    }

    public async Task<TaskViewDto> CreateTaskAsync(int creatorId, TaskCreateDto dto)
    {
        var task = new TaskItem
        {
            Title = dto.Title,
            Description = dto.Description,
            Priority = dto.Priority,
            AssigneeId = dto.AssigneeId,
            CreatorId = creatorId,
            Status = backend.Models.TaskStatus.Todo // Default status
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        // Reload with navigation properties
        await _context.Entry(task)
            .Reference(t => t.Creator)
            .LoadAsync();
        
        if (task.AssigneeId.HasValue)
        {
            await _context.Entry(task)
                .Reference(t => t.Assignee)
                .LoadAsync();
        }

        return MapToViewDto(task);
    }

    public async Task<TaskViewDto?> UpdateTaskAsync(int id, int callerId, string callerRole, TaskUpdateDto dto)
    {
        var task = await _context.Tasks
            .Include(t => t.Creator)
            .Include(t => t.Assignee)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (task == null)
            return null;

        // Authorization check - only creator or admin can update
        if (task.CreatorId != callerId && callerRole != "ADMIN")
            throw new UnauthorizedAccessException("Only the task creator or an admin can update this task");

        // Update basic fields
        if (dto.Title != null)
            task.Title = dto.Title;
        
        if (dto.Description != null)
            task.Description = dto.Description;
        
        if (dto.Priority.HasValue)
            task.Priority = dto.Priority.Value;
        
        if (dto.AssigneeId.HasValue)
            task.AssigneeId = dto.AssigneeId.Value;

        // Status transition guard
        if (!string.IsNullOrEmpty(dto.Status) && Enum.TryParse<backend.Models.TaskStatus>(dto.Status, true, out var newStatus))
        {
            if (newStatus != task.Status)
            {
                if (!IsValidStatusTransition(task.Status, newStatus))
                {
                    throw new InvalidOperationException($"Invalid status transition: {task.Status} → {newStatus}");
                }
                task.Status = newStatus;
            }
        }

        await _context.SaveChangesAsync();

        // Reload assignee if changed
        if (dto.AssigneeId.HasValue)
        {
            await _context.Entry(task)
                .Reference(t => t.Assignee)
                .LoadAsync();
        }

        return MapToViewDto(task);
    }

    public async Task<bool> DeleteTaskAsync(int id, int callerId, string callerRole)
    {
        var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id);
        
        if (task == null)
            return false;

        // Only ADMIN can delete any task; non-admin can only delete their own
        if (callerRole != "ADMIN" && task.CreatorId != callerId)
            throw new UnauthorizedAccessException("Only the task creator or an admin can delete this task");

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        return true;
    }

    public static bool IsValidStatusTransition(backend.Models.TaskStatus from, backend.Models.TaskStatus to)
    {
        // Allow same to same
        if (from == to) return true;

        return from switch
        {
            backend.Models.TaskStatus.Todo => to == backend.Models.TaskStatus.InProgress,
            backend.Models.TaskStatus.InProgress => to == backend.Models.TaskStatus.Done,
            backend.Models.TaskStatus.Done => false, // Can't transition from Done
            _ => false
        };
    }

    private static TaskViewDto MapToViewDto(TaskItem task)
    {
        return new TaskViewDto(
            task.Id,
            task.Title,
            task.Description,
            task.Status.ToString(),
            task.Priority,
            task.AssigneeId,
            task.Assignee?.Username,
            task.CreatorId,
            task.Creator.Username,
            task.CreatedAt,
            task.UpdatedAt
        );
    }
}
