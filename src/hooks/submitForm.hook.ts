// Custom React hook for submitting forms via HTTP requests
// Returns a submitForm function that can be used to send data to a specified endpoint
export const useSubmitForm = () => {
  // submitForm sends a request to the given endpoint with the specified method and data
  // - endpoint: API URL to send the request to
  // - method: HTTP method (default is 'POST')
  // - data: Payload to send in the request body
  const submitForm = async ({
    endpoint,
    method = "POST",
    data,
  }: {
    endpoint: string;
    method?: string;
    data: unknown;
  }) => {
    try {
      // Send HTTP request using fetch API
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Convert data to JSON string
      });

      // Parse the JSON response
      const result = await response.json();
      console.log("Form submission result:", result);
      return result;
    } catch (err) {
      // Log and rethrow any errors encountered during submission
      console.error("Form submission error:", err);
      throw err;
    }
  };

  // Return the submitForm function for use in components
  return { submitForm };
};
