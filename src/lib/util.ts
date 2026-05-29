export const delay = async (milliseconds: number): Promise<void> => {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

export const delayRange = async (minimum: number, maximum: number): Promise<void> => {
  const milliseconds = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
  await delay(milliseconds);
};
