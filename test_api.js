const testApi = async () => {
  try {
    const url =
      "http://localhost:2000/api/v1/portfolio/get?page=1&limit=10&sortBy=createdAt&sort=desc&search=";
    const body = {
      filter: {
        title: "gupta",
      },
    };

    console.log("Sending request to:", url);
    console.log("Body:", JSON.stringify(body, null, 2));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("Response Status:", response.status);
    const data = await response.json();
    console.log("Response Data:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
};

testApi();
