import { describe, expect, it } from "vitest";
import { firstName, greeting } from "./greeting";

describe("firstName", () => {
  it("uses the first word of a Google name", () => {
    expect(firstName({ name: "Alex Kumar" })).toBe("Alex");
  });

  it("prefers the name over the email", () => {
    expect(firstName({ name: "Priya", email: "someone@example.com" })).toBe("Priya");
  });

  it("falls back to the start of the email when it looks like a name", () => {
    expect(firstName({ email: "alex.kumar@example.com" })).toBe("Alex");
    expect(firstName({ email: "jordan+test@example.com" })).toBe("Jordan");
    expect(firstName({ email: "MARIA_lopez@example.com" })).toBe("Maria");
  });

  it("does not greet a random-looking address as a name", () => {
    expect(firstName({ email: "x9f3k2@example.com" })).toBeNull();
    expect(firstName({ email: "a@example.com" })).toBeNull();
    expect(firstName({ email: "12345@example.com" })).toBeNull();
  });

  it("ignores a name that is not a name", () => {
    expect(firstName({ name: "1234", email: "sam@example.com" })).toBe("Sam");
  });

  it("returns null when there is nothing to go on", () => {
    expect(firstName({})).toBeNull();
    expect(firstName({ name: "  ", email: null })).toBeNull();
  });

  it("handles names with accents and apostrophes", () => {
    expect(firstName({ name: "Zoë Smith" })).toBe("Zoë");
    expect(firstName({ name: "O'Brien Jones" })).toBe("O'brien");
  });
});

describe("greeting", () => {
  it("includes the name when known", () => {
    expect(greeting({ name: "Alex Kumar" })).toBe("Welcome back, Alex");
  });

  it("is plain when the name is not known", () => {
    expect(greeting({ email: "x9f3k2@example.com" })).toBe("Welcome back");
  });
});
