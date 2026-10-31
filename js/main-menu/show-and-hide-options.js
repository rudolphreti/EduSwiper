function showOptions(button, optionsContainer, buttonAndOptionsContainer) {
  if (button.style.display !== 'none') {
    button.style.display = 'none';
    optionsContainer.style.display = 'inherit';
    buttonAndOptionsContainer.classList.add('color-div');
  }
}

function hideOptions(e, buttonAndOptionsContainer, button, optionsContainer) {
  var isClickInsideElement = buttonAndOptionsContainer.contains(e.target);
  if (!isClickInsideElement) {
    button.style.display = 'inherit';
    optionsContainer.style.display = 'none';
    buttonAndOptionsContainer.classList.remove('color-div');
  }
}
