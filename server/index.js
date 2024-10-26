const express = require("express");
const cors = require("cors");
const app = express();

const port = 9090;

app.use(cors());

app.use(express.static('dist'));

app.post("/api/registration", (req, res) => {
  if (Math.random() > 0.5) {
    res.statusCode = 400;
    console.log(req.body)
   // const { name, email, phone, message } = req.body;
    const errors = {};

    if (!name) {
        errors.name = "Имя обязательно для заполнения.";
    }
    if (!email) {
        errors.email = "E-mail обязателен для заполнения.";
    } else if (!validateEmail(email)) {
        errors.email = "Введите корректный адрес электронной почты.";
    }
    if (!phone) {
        errors.phone = "Телефон обязателен для заполнения.";
    }
    if (!message) {
        errors.message = "Сообщение обязательно для заполнения.";
    }

    setTimeout(() => {
      res.send({
        status: "error",
        msg: "Bad request",
        fields:{errors}
      });
    }, Math.random() * 1000);

    return;
  }
  
  setTimeout(() => {
    res.statusCode = 200;
    res.send({
      status: "success",
      msg: "You are registered",
    });
  }, Math.random() * 1000);
});

app.get("/api/ping", (req, res) => {
    res.statusCode = 200;
    res.send({
        status: "success",
        message: "Server is ready",
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}