const useQueryString = (query: string) => {
  const searchParams = new URLSearchParams(window?.location?.search);
  const element = searchParams.get(query);

  return element ? element : undefined;
};
export default useQueryString;
