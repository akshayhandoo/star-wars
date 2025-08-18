import "@testing-library/jest-dom";

// Polyfill for react-router / whatwg dependencies
import { TextEncoder, TextDecoder } from "util";

if (typeof global.TextEncoder === "undefined") {
    global.TextEncoder = TextEncoder as any;
}

if (typeof global.TextDecoder === "undefined") {
    global.TextDecoder = TextDecoder as any;
}

beforeAll(() => {
    global.fetch = jest.fn();
});

afterEach(() => {
    (global.fetch as jest.Mock).mockClear();
});