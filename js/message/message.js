const message = document.getElementById('messages-during-PDF-creating'); //niepoprawna nazwa id
const messageContainer = document.getElementById(
  'messages-during-PDF-creating-container'
); //niepoprawna nazwa id
const waitingTime =
  'Potrwa to w zależności od ilości obrazów, ich rozmiarów, jak również szybkości komputera.';

function messageFn(messageArg) {
  message.innerHTML = messageArg;
}
