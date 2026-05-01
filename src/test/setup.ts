import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { server } from "../mocks/server";

// Provide a working localStorage for all tests.
// The lovable.dev build config passes --localstorage-file which breaks jsdom's default.
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
  removeItem: vi.fn((key: string) => { delete store[key]; }),
  clear: vi.fn(() => { Object.keys(store).forEach((k) => delete store[k]); }),
};
Object.defineProperty(global, "localStorage", { value: localStorageMock, writable: true });

// Seed a real API key so isDemoMode() returns false in all tests
store["ainative_token"] = "sk_test_key";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
