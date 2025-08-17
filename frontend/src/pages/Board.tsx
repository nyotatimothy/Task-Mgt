import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { TaskItem, TaskCreateDto, TaskUpdateDto } from "../types/task";
import { User } from "../types/user";
import { TaskCard } from "../components/TaskCard";
import { TaskModal } from "../components/TaskModal";
import { apiGet, apiPost, apiPut, apiDelete } from "../api/client";
import { useTasksHub } from "../hooks/useTasksHub";

export function Board() {
  const { username, role, logout } = useAuth();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("");
  const [textFilter, setTextFilter] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | undefined>();

  // SignalR for realtime updates
  const { connected } = useTasksHub({
    onUpdated: () => {
      console.log("Realtime task update - refetching tasks");
      loadTasks();
    },
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    await Promise.all([loadTasks(), loadUsers()]);
    setLoading(false);
  };

  const loadTasks = async () => {
    const params = new URLSearchParams();
    if (statusFilter) params.append("status", statusFilter);
    if (assigneeFilter) params.append("assignee", assigneeFilter);

    const result = await apiGet<TaskItem[]>(`/tasks?${params}`);
    if (result.data) {
      setTasks(result.data);
      setError("");
    } else {
      setError(result.error || "Failed to load tasks");
    }
  };

  const loadUsers = async () => {
    const result = await apiGet<User[]>("/users");
    if (result.data) {
      setUsers(result.data);
    }
  };

  // Refetch tasks when filters change
  useEffect(() => {
    if (!loading) {
      loadTasks();
    }
  }, [statusFilter, assigneeFilter]);

  const handleCreateTask = async (data: TaskCreateDto) => {
    const result = await apiPost<TaskItem>("/tasks", data);
    if (result.data) {
      await loadTasks(); // Refetch all tasks
      setError("");
    } else {
      setError(result.error || "Failed to create task");
    }
  };

  const handleUpdateTask = async (data: TaskUpdateDto) => {
    if (!editingTask) return;

    const result = await apiPut<TaskItem>(`/tasks/${editingTask.id}`, data);
    if (result.data) {
      await loadTasks(); // Refetch all tasks
      setError("");
    } else {
      setError(result.error || "Failed to update task");
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    const result = await apiDelete(`/tasks/${id}`);
    if (result.error) {
      setError(result.error);
    } else {
      await loadTasks(); // Refetch all tasks
      setError("");
    }
  };

  const openCreateModal = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (task: TaskItem) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  const handleModalSave = async (data: TaskCreateDto | TaskUpdateDto) => {
    if (editingTask) {
      await handleUpdateTask(data as TaskUpdateDto);
    } else {
      await handleCreateTask(data as TaskCreateDto);
    }
  };

  // Filter tasks by text locally
  const filteredTasks = tasks.filter(
    (task) =>
      textFilter === "" ||
      task.title.toLowerCase().includes(textFilter.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(textFilter.toLowerCase())),
  );

  const todoTasks = filteredTasks.filter((task) => task.status === "Todo");
  const inProgressTasks = filteredTasks.filter(
    (task) => task.status === "InProgress",
  );
  const doneTasks = filteredTasks.filter((task) => task.status === "Done");

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Task Board</h1>
        <div>
          <span style={{ marginRight: "15px" }}>
            Welcome, {username} ({role})
          </span>
          <span
            style={{
              marginRight: "15px",
              fontSize: "12px",
              color: connected ? "#28a745" : "#6c757d",
            }}
          >
            {connected ? "🟢 Live" : "🔴 Offline"}
          </span>
          <button
            onClick={logout}
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
        }}
      >
        <div>
          <label>Status: </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "5px" }}
          >
            <option value="">All</option>
            <option value="Todo">Todo</option>
            <option value="InProgress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div>
          <label>Assignee: </label>
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            style={{ padding: "5px" }}
          >
            <option value="">All</option>
            {users.map((user) => (
              <option key={user.id} value={user.id.toString()}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Search: </label>
          <input
            type="text"
            value={textFilter}
            onChange={(e) => setTextFilter(e.target.value)}
            placeholder="Search tasks..."
            style={{ padding: "5px" }}
          />
        </div>

        <button
          onClick={openCreateModal}
          style={{
            marginLeft: "auto",
            padding: "8px 16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          New Task
        </button>
      </div>

      {/* Board Columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "20px",
          height: "calc(100vh - 250px)",
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: "#f8f9fa",
          }}
        >
          <h3
            style={{
              padding: "15px",
              margin: 0,
              backgroundColor: "#e9ecef",
              borderRadius: "4px 4px 0 0",
            }}
          >
            Todo ({todoTasks.length})
          </h3>
          <div
            style={{
              padding: "15px",
              height: "calc(100% - 60px)",
              overflowY: "auto",
            }}
          >
            {todoTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEditModal}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: "#fff3cd",
          }}
        >
          <h3
            style={{
              padding: "15px",
              margin: 0,
              backgroundColor: "#ffeeba",
              borderRadius: "4px 4px 0 0",
            }}
          >
            In Progress ({inProgressTasks.length})
          </h3>
          <div
            style={{
              padding: "15px",
              height: "calc(100% - 60px)",
              overflowY: "auto",
            }}
          >
            {inProgressTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEditModal}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: "#d4edda",
          }}
        >
          <h3
            style={{
              padding: "15px",
              margin: 0,
              backgroundColor: "#c3e6cb",
              borderRadius: "4px 4px 0 0",
            }}
          >
            Done ({doneTasks.length})
          </h3>
          <div
            style={{
              padding: "15px",
              height: "calc(100% - 60px)",
              overflowY: "auto",
            }}
          >
            {doneTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEditModal}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleModalSave}
        task={editingTask}
        users={users}
      />
    </div>
  );
}
