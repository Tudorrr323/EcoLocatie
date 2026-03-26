// commentsRepository — acces la comentariile observatiilor via API.
// Suporta listare paginata, adaugare, stergere si raspunsuri (replies).

import { apiGet, apiPost, apiDelete } from '../services/apiClient';
import type { Comment } from '../types/plant.types';
import { getMockCommentsForPOI } from '../mock/mockData';

interface CommentsListResponse {
  data: ApiComment[];
  total: number;
  page: number;
}

interface ApiComment {
  id: number;
  user_id: number;
  poi_id: number;
  content: string;
  username: string;
  profile_image?: string;
  parent_id?: number | null;
  created_at: string;
}

function normalizeComment(api: ApiComment): Comment {
  return {
    id: api.id,
    user_id: api.user_id,
    poi_id: api.poi_id,
    content: api.content,
    username: api.username ?? '',
    profile_image: api.profile_image,
    parent_id: api.parent_id ?? null,
    created_at: api.created_at,
  };
}

function buildTree(comments: Comment[]): Comment[] {
  const map = new Map<number, Comment>();
  const roots: Comment[] = [];

  for (const c of comments) {
    map.set(c.id, { ...c, replies: [] });
  }

  for (const c of map.values()) {
    if (c.parent_id && map.has(c.parent_id)) {
      map.get(c.parent_id)!.replies!.push(c);
    } else {
      roots.push(c);
    }
  }

  return roots;
}

export async function getComments(
  poiId: number,
  page = 1,
  limit = 50,
): Promise<{ comments: Comment[]; total: number; page: number }> {
  try {
    const response = await apiGet<CommentsListResponse>(
      `/api/comments/poi/${poiId}?page=${page}&limit=${limit}`,
    );
    const flat = response.data.map(normalizeComment);
    return {
      comments: buildTree(flat),
      total: response.total,
      page: response.page,
    };
  } catch {
    const mock = getMockCommentsForPOI(poiId);
    return { comments: buildTree(mock), total: mock.length, page: 1 };
  }
}

export async function addComment(
  poiId: number,
  content: string,
  parentId?: number,
): Promise<Comment | null> {
  try {
    const body: Record<string, unknown> = { content };
    if (parentId) body.parent_id = parentId;
    const api = await apiPost<ApiComment>(`/api/comments/${poiId}`, body, true);
    return normalizeComment(api);
  } catch {
    return null;
  }
}

export async function deleteComment(commentId: number): Promise<boolean> {
  try {
    await apiDelete(`/api/comments/${commentId}`, true);
    return true;
  } catch {
    return false;
  }
}
