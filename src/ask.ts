import consola from 'npm:consola';

export async function ask(
  question: string,
  placeholder?: string,
): Promise<string> {
  return await consola.prompt(question, {
    placeholder,
  }) as string ?? '';
}

export async function askSelect(
  question: string,
  options: { label: string; value: string }[],
): Promise<string> {
  return await consola.prompt(question, {
    type: 'select',
    options,
  }) as unknown as Promise<string>;
}

export async function askConfirm(
  question: string,
): Promise<boolean> {
  return await consola.prompt(question, {
    type: 'confirm',
  }) as unknown as Promise<boolean>;
}
