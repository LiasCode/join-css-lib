const fs = require("fs");
const path = require("path");

const argumentosPermitidos = ["entry", "minified"];

const config = {
  direcctionFile: "",
  pathCurrentFile: "",
};

createConfig(processArgv(process.argv));

// Pracesando argumentos de entrada y creando configuracion
function processArgv(argv = [""]) {
  let argumentosParsed = [];

  for (let i = 2; i < argv.length; i++) {
    if (argv[i].startsWith("--") || argv[i].startsWith("-")) {
      argumentosParsed.push({
        type: argv[i].startsWith("--")
          ? argv[i].replace("--", "")
          : argv[i].replace("-", "").trim(),
        value: argv[i + 1],
      });

      ++i;
    }
  }

  return argumentosParsed;
}
function createConfig(argumentosParsed = [{ type: "", value: "" }]) {
  let isEntryDefined = false;

  argumentosParsed.forEach(({ type, value }) => {
    if (argumentosPermitidos.includes(type)) {
      config[type] = value;
    }
    if (type === "entry") {
      config.direcctionFile = path.join(process.cwd(), value);
      config.pathCurrentFile = config.direcctionFile.substring(0,config.direcctionFile.lastIndexOf("/")) + "/";
      isEntryDefined = true;
    }
  });

  if (isEntryDefined === false) {
    throw new Error("No esta definido la propiedad 'entry' ");
  }
}

// Libs para crear leer y juntar los archivos css a partir de un html
function extractHrefContent(linkTag = "") {
  linkTag = linkTag.trim();
  linkTag = linkTag.replace("<", "");
  linkTag = linkTag.replace(">", "");

  linkTag = linkTag.substring(linkTag.indexOf("href"));
  linkTag = linkTag.replace("href", "");
  linkTag = linkTag.replace("=", "");
  linkTag = linkTag.trim();

  const hrefContent = linkTag.split('"')[1].trim();

  return hrefContent;
}

function joinFiles(directions = []) {
  let finalContent = "";

  directions.forEach((direction) => {
    const file = fs.readFileSync(path.join(config.pathCurrentFile, direction));
    finalContent += file.toString();
  });

  fs.writeFileSync(
    path.join(config.pathCurrentFile, "bundle.css"),
    finalContent,
    {
      encoding: "utf-8",
    }
  );
}

function processInputFile(fileDirection = "") {
  const fileData = fs.readFileSync(fileDirection);

  const htmlParsed = fileData.toString("utf-8");
  const htmlSplited = htmlParsed.split("\n");

  let finalDirecctions = [];

  htmlSplited.forEach((line, index) => {
    if (line.includes("link")) {
      if (line.includes('rel="stylesheet"')) {
        if (!line.includes("href")) {
          throw new Error("line " + index + " do not have an href attribute");
        } else {
          //   console.log(line);
          finalDirecctions.push(extractHrefContent(line));
        }
      }
    }
  });

  joinFiles(finalDirecctions);
}

function INIT (fileDirection) {
    processInputFile(fileDirection);
}
// INIT process
INIT(config.direcctionFile);
