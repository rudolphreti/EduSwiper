function removeCardFn() {
  const arrayPosition = parseInt(
    this.parentNode.querySelector('img').id.match(/\d+/g)[0]
  );
  this.parentElement.remove();
  instanceArray[arrayPosition].destroy();

  instanceArray.splice(arrayPosition, 1);
  cardSet.cards.splice(arrayPosition, 1);

  document
    .querySelectorAll('.card-container .img-container > img')
    .forEach((el, i) => {
      el.id = `image${i}`;
    });
  messageFn(
    `Usunięto kartę. Aktualna liczba kart w zestawie: ${instanceArray.length}`
  );
}
