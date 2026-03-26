// CommentSection — sectiune de comentarii cu lista, input, reply, stergere si paginare.
// Folosita in MapScreen (bottom sheet), PlantDetailScreen si MyPlantDetailScreen.
// Input-ul se ridica automat deasupra tastaturii prin KeyboardAvoidingView intern.

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Send, Reply, Trash2, MessageCircle } from 'lucide-react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { useTranslation } from '../i18n';
import { useAuthContext } from '../context/AuthContext';
import { ConfirmModal } from './ConfirmModal';
import { fonts, spacing, borderRadius } from '../styles/theme';
import type { ThemeColors } from '../styles/theme';
import type { Comment } from '../types/plant.types';
import {
  getComments,
  addComment,
  deleteComment,
} from '../repository/commentsRepository';

interface CommentSectionProps {
  poiId: number;
  compact?: boolean;
}

function getTimeAgo(dateString: string, t: ReturnType<typeof useTranslation>): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return t.shared.comments.justNow;
  if (diffMin < 60) return t.shared.comments.minutesAgo.replace('{{count}}', String(diffMin));
  if (diffHours < 24) return t.shared.comments.hoursAgo.replace('{{count}}', String(diffHours));
  return t.shared.comments.daysAgo.replace('{{count}}', String(diffDays));
}

export function CommentSection({ poiId, compact }: CommentSectionProps) {
  const colors = useThemeColors();
  const t = useTranslation();
  const { user, isAdmin } = useAuthContext();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Comment | null>(null);

  const fetchComments = useCallback(async (p = 1) => {
    setLoading(true);
    const result = await getComments(poiId, p, 20);
    if (p === 1) {
      setComments(result.comments);
    } else {
      setComments((prev) => [...prev, ...result.comments]);
    }
    setTotal(result.total);
    setPage(p);
    setLoading(false);
  }, [poiId]);

  useEffect(() => {
    fetchComments(1);
  }, [fetchComments]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    const newComment = await addComment(poiId, text, replyTo?.id);
    if (newComment) {
      await fetchComments(1);
      setInput('');
      setReplyTo(null);
    }
    setSending(false);
  }, [input, sending, poiId, replyTo, fetchComments]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const ok = await deleteComment(deleteTarget.id);
    if (ok) {
      await fetchComments(1);
    }
    setDeleteTarget(null);
  }, [deleteTarget, fetchComments]);

  const hasMore = comments.length < total;

  const renderReply = useCallback((reply: Comment) => {
    const canDelete = user && (user.id === reply.user_id || isAdmin);
    return (
      <View key={reply.id} style={styles.replyContainer}>
        <View style={styles.replyLine} />
        <View style={styles.replyContent}>
          <View style={styles.commentHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{reply.username.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.commentMeta}>
              <Text style={styles.username}>{reply.username}</Text>
              <Text style={styles.time}>{getTimeAgo(reply.created_at, t)}</Text>
            </View>
            {canDelete && (
              <TouchableOpacity onPress={() => setDeleteTarget(reply)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Trash2 size={14} color={colors.error} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.commentText}>{reply.content}</Text>
        </View>
      </View>
    );
  }, [colors, styles, t, user, isAdmin]);

  const renderComment = useCallback(({ item }: { item: Comment }) => {
    const canDelete = user && (user.id === item.user_id || isAdmin);
    return (
      <View style={styles.commentContainer}>
        <View style={styles.commentHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.username.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.commentMeta}>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.time}>{getTimeAgo(item.created_at, t)}</Text>
          </View>
          <View style={styles.commentActions}>
            <TouchableOpacity
              onPress={() => setReplyTo(item)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.actionBtn}
            >
              <Reply size={14} color={colors.textSecondary} />
            </TouchableOpacity>
            {canDelete && (
              <TouchableOpacity
                onPress={() => setDeleteTarget(item)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.actionBtn}
              >
                <Trash2 size={14} color={colors.error} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Text style={styles.commentText}>{item.content}</Text>

        {item.replies && item.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {item.replies.map(renderReply)}
          </View>
        )}
      </View>
    );
  }, [colors, styles, t, user, isAdmin, renderReply]);

  const keyExtractor = useCallback((item: Comment) => String(item.id), []);

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      {/* Comment list */}
      {loading && comments.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : comments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MessageCircle size={32} color={colors.textSecondary} />
          <Text style={styles.emptyText}>{t.shared.comments.empty}</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={keyExtractor}
            scrollEnabled={false}
            nestedScrollEnabled
          />
          {hasMore && (
            <TouchableOpacity
              style={styles.loadMoreBtn}
              onPress={() => fetchComments(page + 1)}
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={styles.loadMoreText}>{t.shared.comments.loadMore}</Text>
              )}
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Reply indicator */}
      {replyTo && (
        <View style={styles.replyIndicator}>
          <Reply size={14} color={colors.primary} />
          <Text style={styles.replyIndicatorText}>
            {t.shared.comments.replyTo.replace('{{name}}', replyTo.username)}
          </Text>
          <TouchableOpacity onPress={() => setReplyTo(null)}>
            <Text style={styles.replyCancel}>{t.shared.comments.cancelReply}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Input */}
      {user && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={t.shared.comments.placeholder}
            placeholderTextColor={colors.placeholderText}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            editable={!sending}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!input.trim() || sending) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!input.trim() || sending}
            activeOpacity={0.7}
          >
            {sending ? (
              <ActivityIndicator size="small" color={colors.textLight} />
            ) : (
              <Send size={18} color={colors.textLight} />
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Delete confirmation */}
      <ConfirmModal
        visible={deleteTarget !== null}
        title={t.shared.comments.delete}
        message={t.shared.comments.deleteConfirm}
        confirmLabel={t.shared.common.delete}
        cancelLabel={t.shared.common.cancel}
        confirmDestructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  containerCompact: {
    paddingVertical: 0,
  },
  loadingContainer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  commentContainer: {
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: fonts.sizes.sm,
    fontWeight: '700',
    color: colors.textLight,
  },
  commentMeta: {
    flex: 1,
  },
  username: {
    fontSize: fonts.sizes.sm,
    fontWeight: '600',
    color: colors.text,
  },
  time: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
  },
  commentActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    padding: spacing.xs,
  },
  commentText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    lineHeight: 20,
    marginLeft: 30 + spacing.sm,
  },
  repliesContainer: {
    marginLeft: 30 + spacing.sm,
    marginTop: spacing.xs,
  },
  replyContainer: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  replyLine: {
    width: 2,
    backgroundColor: colors.border,
    marginRight: spacing.sm,
    borderRadius: 1,
  },
  replyContent: {
    flex: 1,
    paddingVertical: spacing.xs,
  },
  replyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  replyIndicatorText: {
    flex: 1,
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  replyCancel: {
    fontSize: fonts.sizes.sm,
    color: colors.error,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fonts.sizes.md,
    color: colors.text,
    maxHeight: 80,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  loadMoreBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  loadMoreText: {
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    fontWeight: '600',
  },
});
