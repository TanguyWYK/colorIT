"use strict";

function downloadFile(fileName, content) {
  let element = document.createElement("a");
  element.setAttribute("href", content);
  element.setAttribute("download", fileName);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

class ExportCSV {
  constructor(fileName, delemiter = ";", delemiterJumpLine = ";\n") {
    this.fileName = fileName;
    this.values = [];
    this.delemiter = delemiter;
    this.delemiterJumpLine = delemiterJumpLine;
  }

  addLineOfValues(line) {
    this.values.push(line);
  }

  generateCsvFiles() {
    let csvString = this.convertResultToCsvString();
    this.downloadCsvFile(csvString);
  }

  jumpLine() {
    this.values.push(["\n"]);
  }

  convertResultToCsvString() {
    let csvResults = "";
    for (let line of this.values) {
      csvResults +=
        line.map((word) => this.cleanUTF8("" + word)).join(this.delemiter) + this.delemiterJumpLine;
    }
    return csvResults;
  }

  downloadCsvFile(csvString) {
    downloadFile(this.fileName, "data:text/plain;charset=utf-8," + csvString);
  }

  cleanUTF8(text) {
    if (text !== false) {
      return text.replace(/[éè]/g, "e");
    } else {
      return "";
    }
  }
}

function csvToArray(str) {
  str = str.trim();
  let input = str.split("\n").map((line) => line.split(","));
  input = input.map((line) => line.map((x) => x * 1));
  return input;
}
