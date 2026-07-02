// Placeholder for shared TypeScript types.
// TODO: Expand each type with real fields as the API schema is defined.

export type User = {
  id: string;
  // TODO: add fields (name, email, role, etc.)
};

export type Event = {
  id: string;
  slug: string;
  // TODO: add fields (title, description, date, capacity, etc.)
};

export type Registration = {
  id: string;
  // TODO: add fields (userId, eventId, status, createdAt, etc.)
};

export type Ticket = {
  id: string;
  // TODO: add fields (registrationId, qrCode, isCheckedIn, etc.)
};
