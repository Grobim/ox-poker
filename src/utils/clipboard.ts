function copyToClipboard(content: string) {
  const inputField = document.createElement("textarea");
  document.body.appendChild(inputField);
  inputField.value = content;
  inputField.select();
  document.execCommand("copy");
  document.body.removeChild(inputField);
}

export { copyToClipboard };
