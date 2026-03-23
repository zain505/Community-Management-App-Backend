export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
}

export interface UpdateAnnouncementRequest {
  title?: string;
  content?: string;
}

export interface AnnouncementListQuery {
  search?: string;
  page?: number;
}
