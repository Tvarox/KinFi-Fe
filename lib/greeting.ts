/**
 * A first name to greet someone with, or null if we cannot tell.
 *
 * Uses the name on a Google account when there is one. Otherwise it takes the
 * start of the email address, but only when that looks like a name (letters
 * only), so "x9f3k2@mail.com" is not greeted as "X9f3k2".
 */
export function firstName(input: { name?: string | null; email?: string | null }): string | null {
  const fromName = input.name?.trim().split(/\s+/)[0];
  if (fromName && /^\p{L}[\p{L}'-]*$/u.test(fromName)) return capitalize(fromName);

  const local = input.email?.split("@")[0] ?? "";
  const word = local.split(/[._+-]/)[0];
  if (word && /^\p{L}{2,20}$/u.test(word)) return capitalize(word);

  return null;
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function greeting(input: { name?: string | null; email?: string | null }): string {
  const name = firstName(input);
  return name ? `Welcome back, ${name}` : "Welcome back";
}
