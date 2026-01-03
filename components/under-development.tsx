export const UnderDevelopment = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-default-200 bg-default-50 p-6 text-center dark:border-default-800 dark:bg-black-900">
      <span className="text-4xl">🚧</span>
      <h2 className="text-2xl font-semibold dark:text-white">
        Under Development
      </h2>
      <p className="text-default-500 dark:text-gray-300">
        This feature is currently under development. Please check back later!
      </p>
    </div>
  );
};
