function sort(list) {
  var txtAndHrefs = [];
  var txtArr = [];

  list.querySelectorAll('li a').forEach((el) => {
    const obj = new Object();
    obj.txt = el.innerText;
    obj.href = el.href;
    txtAndHrefs.push(obj);
    txtArr.push(el.innerText);
  });

  list.innerHTML = '';

  txtArr.sort();

  txtArr.forEach((txtArrTxt) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    const span = document.createElement('span');
    span.innerText = txtArrTxt;
    span.setAttribute('data-mlr-text', '');

    txtAndHrefs.forEach((txtAndHrefsTxt) => {
      if (txtAndHrefsTxt['txt'] === txtArrTxt) {
        a.href = txtAndHrefsTxt['href'];
      }
    });

    a.appendChild(span);
    li.appendChild(a);
    list.appendChild(li);
  });
}
