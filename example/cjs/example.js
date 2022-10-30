const express = require("express");
const app = express();

const { left, right } = require("@tbtk-site/tbtk-either");

function beDivByTen(a) {
  return (a === 0) ? left("division by zero") : right(10 / a);
}

app.get("/", (req, res) => {
  let a = beDivByTen(2);
  let e = beDivByTen(0);

  res.send("a:" + a.getRight() + "<br />" + "e:" + e.getLeft());
});

app.listen(3000, () => {
  console.log(`Example app listening on port ${3000}`);
});
