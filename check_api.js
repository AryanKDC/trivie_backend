fetch("http://localhost:2000/api/frontend/portfolio")
  .then((res) => res.json())
  .then((data) => console.log(JSON.stringify(data, null, 2)))
  .catch((err) => console.error(err));
