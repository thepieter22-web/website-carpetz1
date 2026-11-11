// Laat TypeScript controleren dat elke vertaalsleutel bestaat (op basis van nl.json).
type Messages = typeof import('./messages/nl.json')

// eslint-disable-next-line @typescript-eslint/no-empty-interface
declare interface IntlMessages extends Messages {}
