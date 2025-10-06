export async function unix_timestamp() {
  const date = new Date().getTime();

  return Math.round(date / 1000);
}

export async function stamp(): Promise<[number, string]> {
  const timestamp = await unix_timestamp();
  const uuid = crypto.randomUUID();

  return [timestamp, uuid];
}
