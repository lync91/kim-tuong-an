export const html = `<!DOCTYPE html>
<head>
<meta charset="UTF-8">
<style>
* {
  box-sizing: border-box;
}

/* Create two equal columns that floats next to each other */
.column {
  float: left;
  width: 25%;
  padding: 10px;
  height: 300px; /* Should be removed. Only for demonstration */
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
.center {
  text-align: center;
}
.bangchu:first-letter {
  text-transform: uppercase;
}
</style>
</head>
<html>
<body>
{body}
</body>
</html>
`;
