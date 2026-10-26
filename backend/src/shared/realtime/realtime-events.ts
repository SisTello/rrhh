export const RealtimeNamespace = {
  chat: '/chat',
  notifications: '/notifications',
  announcements: '/announcements',
  approvals: '/approvals',
} as const;

export const RealtimeEvent = {
  chat: {
    messageCreated: 'chat.message.created',
  },
  notifications: {
    created: 'notification.created',
  },
  announcements: {
    published: 'announcement.published',
  },
  approvals: {
    updated: 'approval.updated',
  },
} as const;
