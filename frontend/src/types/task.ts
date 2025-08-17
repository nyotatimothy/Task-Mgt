export interface TaskItem {
  id: number;
  title: string;
  description?: string;
  status: 'Todo' | 'InProgress' | 'Done';
  priority: number;
  assigneeId?: number;
  assigneeName?: string;
  creatorId: number;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCreateDto {
  title: string;
  description?: string;
  priority?: number;
  assigneeId?: number;
}

export interface TaskUpdateDto {
  title?: string;
  description?: string;
  status?: 'Todo' | 'InProgress' | 'Done';
  priority?: number;
  assigneeId?: number;
}
