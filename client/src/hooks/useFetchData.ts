const useFetchData = async (url: string, options: RequestInit) => {
  try {
    const response = await fetch(url, options);

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

export default useFetchData;