// jest-dom adds custom jest matchers for asserting on DOM nodes.
import "@testing-library/jest-dom";
import { act } from "react";

// Mock canvas for TimePicker
HTMLCanvasElement.prototype.getContext = jest.fn();

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Configure React's act for testing
global.React = { act } as any;
