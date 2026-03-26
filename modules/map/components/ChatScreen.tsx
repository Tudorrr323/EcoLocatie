// ChatScreen — ecran de conversație cu chatbot-ul AI EcoLocation.
// Suportă istoric conversații (AsyncStorage), titluri editabile, ștergere.
// Două view-uri: lista conversații (history) și conversația activă (chat).

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Platform,
  Modal,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Send, Bot, User, Plus, MoreVertical, Pencil, Trash2, MessageCircle } from 'lucide-react-native';
import { useSettings } from '../../../shared/context/SettingsContext';
import { apiPost } from '../../../shared/services/apiClient';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';
import { fonts, spacing, borderRadius } from '../../../shared/styles/theme';
import type { ThemeColors } from '../../../shared/styles/theme';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useTranslation } from '../../../shared/i18n';
import { useAuthContext } from '../../../shared/context/AuthContext';

// ── Types ────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
}

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

interface ChatResponse {
  answer: string;
  sources?: string[];
}

interface ChatScreenProps {
  visible: boolean;
  onClose: () => void;
}

const STORAGE_KEY = '@ecolocatie_chat_history';

// ── Storage helpers ──────────────────────────────────────────

async function loadConversations(): Promise<Conversation[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

async function saveConversations(convos: Conversation[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(convos));
}

// ── Main Component ───────────────────────────────────────────

export function ChatScreen({ visible, onClose }: ChatScreenProps) {
  const colors = useThemeColors();
  const { resolvedTheme } = useSettings();
  const t = useTranslation();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'history' | 'chat'>('history');

  // Edit/delete modals
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [menuConvoId, setMenuConvoId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const flatListRef = useRef<FlatList>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Track keyboard height for Android (KeyboardAvoidingView doesn't work in Modal)
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const activeConvo = useMemo(
    () => conversations.find((c) => c.id === activeConvoId) ?? null,
    [conversations, activeConvoId],
  );

  // Load conversations on open
  useEffect(() => {
    if (visible) {
      loadConversations().then(setConversations);
    }
  }, [visible]);

  // ── Actions ──────────────────────────────────────────────

  const createNewChat = useCallback(() => {
    const newConvo: Conversation = {
      id: `chat-${Date.now()}`,
      title: t.map.chat.defaultTitle,
      messages: [{
        id: 'welcome',
        role: 'assistant',
        content: t.map.chat.welcome,
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newConvo, ...conversations];
    setConversations(updated);
    saveConversations(updated);
    setActiveConvoId(newConvo.id);
    setView('chat');
    setInput('');
  }, [conversations, t]);

  const openConversation = useCallback((id: string) => {
    setActiveConvoId(id);
    setView('chat');
    setInput('');
  }, []);

  const goToHistory = useCallback(() => {
    setView('history');
    setActiveConvoId(null);
  }, []);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || !activeConvoId) return;

    const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: text };

    setConversations((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== activeConvoId) return c;
        const isFirstUserMsg = !c.messages.some((m) => m.role === 'user');
        return {
          ...c,
          messages: [...c.messages, userMsg],
          // Auto-set title from first user message
          title: isFirstUserMsg ? text.slice(0, 50) : c.title,
          updatedAt: new Date().toISOString(),
        };
      });
      saveConversations(updated);
      return updated;
    });
    setInput('');
    setLoading(true);

    try {
      const body: Record<string, unknown> = { question: text };
      if (user?.id) body.user_id = user.id;
      const response = await apiPost<ChatResponse>('/api/chat', body);

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
      };
      setConversations((prev) => {
        const updated = prev.map((c) =>
          c.id === activeConvoId
            ? { ...c, messages: [...c.messages, assistantMsg], updatedAt: new Date().toISOString() }
            : c,
        );
        saveConversations(updated);
        return updated;
      });
    } catch {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: t.map.chat.errorMessage,
      };
      setConversations((prev) => {
        const updated = prev.map((c) =>
          c.id === activeConvoId ? { ...c, messages: [...c.messages, errorMsg] } : c,
        );
        saveConversations(updated);
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }, [input, loading, activeConvoId, user, t]);

  const handleEditTitle = useCallback(() => {
    if (!menuConvoId) return;
    setConversations((prev) => {
      const updated = prev.map((c) =>
        c.id === menuConvoId ? { ...c, title: editTitle.trim() || c.title } : c,
      );
      saveConversations(updated);
      return updated;
    });
    setEditModalVisible(false);
    setMenuConvoId(null);
    setEditTitle('');
  }, [menuConvoId, editTitle]);

  const handleDeleteChat = useCallback(() => {
    if (!menuConvoId) return;
    setConversations((prev) => {
      const updated = prev.filter((c) => c.id !== menuConvoId);
      saveConversations(updated);
      return updated;
    });
    if (activeConvoId === menuConvoId) {
      setView('history');
      setActiveConvoId(null);
    }
    setDeleteModalVisible(false);
    setMenuConvoId(null);
  }, [menuConvoId, activeConvoId]);

  // ── Render: Message bubble ───────────────────────────────

  const renderMessage = useCallback(({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageBubbleRow, isUser && styles.messageBubbleRowUser]}>
        {!isUser && (
          <View style={styles.avatarBot}><Bot size={16} color={colors.textLight} /></View>
        )}
        <View style={[styles.messageBubble, isUser ? styles.messageBubbleUser : styles.messageBubbleAssistant]}>
          <Text style={[styles.messageText, isUser && styles.messageTextUser]}>{item.content}</Text>
          {item.sources && item.sources.length > 0 && (
            <View style={styles.sourcesRow}>
              <Text style={styles.sourcesLabel}>{t.map.chat.sources}:</Text>
              <Text style={styles.sourcesText}>{item.sources.join(', ')}</Text>
            </View>
          )}
        </View>
        {isUser && (
          <View style={styles.avatarUser}><User size={16} color={colors.textLight} /></View>
        )}
      </View>
    );
  }, [colors, styles, t]);

  // ── Render: Conversation list item ───────────────────────

  const renderConvoItem = useCallback(({ item }: { item: Conversation }) => {
    const msgCount = item.messages.filter((m) => m.role === 'user').length;
    const lastMsg = item.messages[item.messages.length - 1];
    const preview = lastMsg ? lastMsg.content.slice(0, 60) + (lastMsg.content.length > 60 ? '...' : '') : '';

    return (
      <TouchableOpacity
        style={styles.convoItem}
        onPress={() => openConversation(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.convoIcon}>
          <MessageCircle size={18} color={colors.logoTeal} />
        </View>
        <View style={styles.convoInfo}>
          <Text style={styles.convoTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.convoPreview} numberOfLines={1}>{preview}</Text>
        </View>
        <TouchableOpacity
          style={styles.convoMenu}
          onPress={() => {
            setMenuConvoId(item.id);
            setEditTitle(item.title);
            setEditModalVisible(true);
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MoreVertical size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }, [colors, styles, openConversation]);

  // ── Main render ──────────────────────────────────────────

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <StatusBar barStyle={resolvedTheme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
          {/* ── History View ── */}
          {view === 'history' && (
            <>
              <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={onClose} activeOpacity={0.7}>
                  <ArrowLeft size={22} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                  <View style={styles.headerBotIcon}>
                    <Bot size={18} color={colors.textLight} />
                  </View>
                  <Text style={styles.headerTitle}>{t.map.chat.history}</Text>
                </View>
                <TouchableOpacity style={styles.backBtn} onPress={createNewChat} activeOpacity={0.7}>
                  <Plus size={22} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {conversations.length === 0 ? (
                <View style={styles.emptyState}>
                  <MessageCircle size={48} color={colors.textSecondary} />
                  <Text style={styles.emptyText}>{t.map.chat.noChats}</Text>
                  <TouchableOpacity style={styles.newChatBtn} onPress={createNewChat} activeOpacity={0.7}>
                    <Plus size={18} color={colors.textLight} />
                    <Text style={styles.newChatBtnText}>{t.map.chat.newChat}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <FlatList
                  data={conversations}
                  keyExtractor={(item) => item.id}
                  renderItem={renderConvoItem}
                  contentContainerStyle={styles.convoList}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </>
          )}

          {/* ── Chat View ── */}
          {view === 'chat' && activeConvo && (
            <>
              <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={goToHistory} activeOpacity={0.7}>
                  <ArrowLeft size={22} color={colors.text} />
                </TouchableOpacity>
                <View style={[styles.headerCenter, { flex: 1 }]}>
                  <Text style={styles.headerTitle} numberOfLines={1}>{activeConvo.title}</Text>
                </View>
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => {
                    setMenuConvoId(activeConvo.id);
                    setEditTitle(activeConvo.title);
                    setEditModalVisible(true);
                  }}
                  activeOpacity={0.7}
                >
                  <Pencil size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <FlatList
                  ref={flatListRef}
                  data={activeConvo.messages}
                  keyExtractor={(item) => item.id}
                  renderItem={renderMessage}
                  contentContainerStyle={styles.messagesList}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                  onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
                />

                {loading && (
                  <View style={styles.thinkingRow}>
                    <View style={styles.avatarBot}><Bot size={16} color={colors.textLight} /></View>
                    <View style={styles.thinkingBubble}>
                      <ActivityIndicator size="small" color={colors.primary} />
                      <Text style={styles.thinkingText}>{t.map.chat.thinking}</Text>
                    </View>
                  </View>
                )}

                <View style={[styles.inputContainer, { paddingBottom: keyboardHeight > 0 ? spacing.sm : Math.max(insets.bottom, spacing.sm), marginBottom: keyboardHeight > 0 ? keyboardHeight : 0 }]}>
                  <TextInput
                    style={styles.input}
                    placeholder={t.map.chat.placeholder}
                    placeholderTextColor={colors.placeholderText}
                    value={input}
                    onChangeText={setInput}
                    multiline
                    maxLength={500}
                    editable={!loading}
                    blurOnSubmit={false}
                  />
                  <TouchableOpacity
                    style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]}
                    onPress={handleSend}
                    disabled={!input.trim() || loading}
                    activeOpacity={0.7}
                  >
                    <Send size={20} color={colors.textLight} />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>

      {/* Edit title / Delete modal */}
      <ConfirmModal
        visible={editModalVisible}
        title={t.map.chat.editTitle}
        confirmLabel={t.shared.common.save}
        cancelLabel={t.map.chat.deleteChat}
        confirmDestructive={false}
        onConfirm={handleEditTitle}
        onCancel={() => {
          setEditModalVisible(false);
          setDeleteModalVisible(true);
        }}
      >
        <TextInput
          style={styles.editTitleInput}
          value={editTitle}
          onChangeText={setEditTitle}
          placeholder={t.map.chat.editTitlePlaceholder}
          placeholderTextColor={colors.placeholderText}
          autoFocus
        />
      </ConfirmModal>

      <ConfirmModal
        visible={deleteModalVisible}
        title={t.map.chat.deleteChat}
        message={t.map.chat.deleteConfirm}
        confirmLabel={t.shared.common.delete}
        cancelLabel={t.shared.common.cancel}
        confirmDestructive
        onConfirm={handleDeleteChat}
        onCancel={() => { setDeleteModalVisible(false); setMenuConvoId(null); }}
      />
    </Modal>
  );
}

// ── Styles ───────────────────────────────────────────────────

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  headerBotIcon: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.chatAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: fonts.sizes.lg, fontWeight: '700', color: colors.text },

  // ── History ──
  convoList: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  convoItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  convoIcon: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.chatAccentLight,
    alignItems: 'center', justifyContent: 'center',
  },
  convoInfo: { flex: 1 },
  convoTitle: { fontSize: fonts.sizes.md, fontWeight: '600', color: colors.text },
  convoPreview: { fontSize: fonts.sizes.sm, color: colors.textSecondary, marginTop: 2 },
  convoMenu: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emptyText: { fontSize: fonts.sizes.md, color: colors.textSecondary },
  newChatBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.chatAccent, paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2, borderRadius: borderRadius.lg,
  },
  newChatBtnText: { fontSize: fonts.sizes.md, fontWeight: '600', color: colors.textLight },

  // ── Chat ──
  messagesList: { paddingHorizontal: spacing.md, paddingVertical: spacing.md, paddingBottom: spacing.lg },
  messageBubbleRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: spacing.md, gap: spacing.sm },
  messageBubbleRowUser: { justifyContent: 'flex-end' },
  avatarBot: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.chatAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarUser: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  messageBubble: { maxWidth: '75%', paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2, borderRadius: borderRadius.lg },
  messageBubbleAssistant: { backgroundColor: colors.surface, borderBottomLeftRadius: 4 },
  messageBubbleUser: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  messageText: { fontSize: fonts.sizes.md, color: colors.text, lineHeight: 22 },
  messageTextUser: { color: colors.textLight },
  sourcesRow: {
    flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.xs,
    paddingTop: spacing.xs, borderTopWidth: 1, borderTopColor: colors.border, gap: 4,
  },
  sourcesLabel: { fontSize: fonts.sizes.xs, fontWeight: '600', color: colors.textSecondary },
  sourcesText: { fontSize: fonts.sizes.xs, color: colors.primary, fontStyle: 'italic' },
  thinkingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  thinkingBubble: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm, borderRadius: borderRadius.lg,
  },
  thinkingText: { fontSize: fonts.sizes.sm, color: colors.textSecondary, fontStyle: 'italic' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm,
    paddingHorizontal: spacing.md, paddingTop: spacing.sm,
    backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border,
  },
  input: {
    flex: 1, backgroundColor: colors.background, borderRadius: borderRadius.lg,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm, fontSize: fonts.sizes.md, color: colors.text, maxHeight: 100,
  },
  sendButton: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.chatAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  sendButtonDisabled: { opacity: 0.4 },
  editTitleInput: {
    backgroundColor: colors.background, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.border, padding: spacing.sm,
    fontSize: fonts.sizes.md, color: colors.text, marginTop: spacing.sm,
  },
});
