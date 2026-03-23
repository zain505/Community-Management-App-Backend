export interface EventManagement {
  id: string;
  title: string;
  description: string;
  location: string;
  startAt: string;
  endAt: string | null;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventManagementRequest {
  title: string;
  description: string;
  location: string;
  startAt: string;
  endAt?: string | null;
}

export interface UpdateEventManagementRequest {
  title?: string;
  description?: string;
  location?: string;
  startAt?: string;
  endAt?: string | null;
}

export interface EventManagementListQuery {
  search?: string;
  page?: number;
}
