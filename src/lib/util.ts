type delayDuration = number | [number, number];

/**
 * Wait for a fixed number of milliseconds or a random duration within an inclusive range.
 */
export const delay = async (duration: delayDuration): Promise<void> => {
  const milliseconds = Array.isArray(duration)
    ? Math.floor(Math.random() * (duration[1] - duration[0] + 1)) + duration[0]
    : duration;

  await new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};
