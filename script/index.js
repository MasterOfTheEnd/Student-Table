let count = 0;
let content;

function tableGet(content) {
  const name = document.querySelector('title').innerHTML.replace(' ', '');

  if (localStorage.getItem(name)) {
    content = JSON.parse(localStorage.getItem(name));
  } else {
    content = [{
      id: 1,
      name: 'Денис Кравченко Константинович',
      age: 17,
      startYear: 2022,
      faculty: 'Строительный'
    }, {
      id: 2,
      name: 'Егор Горбунов Андреевич',
      age: 20,
      startYear: 2018,
      faculty: 'IT'
    }, {
      id: 3,
      name: 'Арсений Максимов Сергеевич',
      age: 26,
      startYear: 2016,
      faculty: 'Менеджмент'
    }];
  }

  return content;
}

function tableRender(content) {
  const tbody = document.querySelector('tbody');

  removeTableCard()

  content.forEach(item => {
    const tr = document.createElement('tr');
    const final = [];

    final.push(item.id);

    item.name.split(' ').forEach((item) => {
      final.push(item);
    });

    final.push(item.age,
      (2022 - item.startYear + 1) > 5 ?
       'Выпустился' : (2022 - item.startYear + 1),
       item.faculty
    );

    final.forEach((item) => {
      const td = document.createElement('td');
      td.append(item);
      tr.append(td);
    });

    item.display === 'none' ? tr.style.display = 'none' : false;
    tbody.append(tr)
  });
}

function addNewStudent() {
  const body = document.querySelector('body');
  const container = document.querySelector('.container');
  const btn = document.getElementById('add-btn');
  const menu = document.getElementById('add-menu');
  const close = document.getElementById('close-btn');

  const sortParams = Array.from(document.getElementById('0').children);
  content = tableGet(content);
  tableRender(content);

  sortParams.forEach(item => {
    item.addEventListener('click', (e) => studentSort(e.target.dataset.sort));
  });

  btn.addEventListener('click', function () {
    menu.classList.remove('help');
    container.classList.add('blur');
    body.style.overflowY = 'hidden';
  });

  menu.addEventListener('submit', function (e) {
    e.preventDefault();

    menu.classList.add('help');
    container.classList.remove('blur');
    createTableCard(content, menu);

    menu.reset();
  });

  close.addEventListener('click', function () {
    menu.classList.add('help');
    container.classList.remove('blur');
    body.style.overflowY = 'visible';
  });

  filterCall();
  tableSave(content);
}

function createTableCard(content, menu) {
  let studentName = menu.children.namedItem('name').value.trim().split(" ");

  for (i = 0; i < studentName.length; i++) {
    studentName[i] = studentName[i].slice(0, 1).toUpperCase() + studentName[i].slice(1).toLowerCase();
  }

  const student = {
    id: content.length + 1,
    name: `${studentName[1]} ${studentName[0]} ${studentName[2]}`,
    age: Math.floor(((Date.now() - menu.children.namedItem('birthday').valueAsDate) / 1000 / 60 / 60 / 24 / 30 / 12)),
    startYear: menu.children.namedItem('startYear').valueAsNumber,
    faculty: menu.children.namedItem('faculty').value
  };

  content.push(student);

  tableSave(content);
  tableRender(content);
}

function removeTableCard() {
  const children = document.querySelector('tbody');

  while (children.firstChild) {
    children.removeChild(children.firstChild);
  }
}

function studentSort(params) {
  count++;

  if (params === 'firstName' || 'lastName' || 'surname') {
    content.forEach((item) => {
      item.firstName = item.name.split(" ")[0];
      item.lastName = item.name.split(" ")[1];
      item.surname = item.name.split(" ")[2];
    });
  }

  switch (count) {
    case 1:
      content.sort((a, b) => a[params] > b[params] ? 1 : -1);
      break;
    case 2:
      content.reverse();
      break
    default:
      content.sort((a, b) => a.id > b.id ? 1 : -1);
      count = 0;
      break;
  }

  if (params === 'firstName' || 'lastName' || 'surname') {
    content.forEach((item) => {
      delete item.firstName;
      delete item.lastName;
      delete item.surname;
    });
  }

  tableRender(content);
}

function filterCall() {
  const input = document.querySelector('.filter-input');
  const select = document.querySelector('.filter-select');

  input.addEventListener('change', function(e) {
    filterCallback(input, select, content);
  });
  select.addEventListener('change', function(e) {
    filterCallback(input, select, content);
  });
}

function filterCallback(input, select, content) {
  const tableChildren = document.querySelector('tbody').children;
  const filter = input.value;
  let temp;

  if (filter == '') {
    content.forEach((item) => item.display = '')

    tableRender(content);
    return
  }

  switch (select.value.toString()) {
    case 'name':
      temp = filter.toString().toLowerCase().split('');

      for (i = 0; i < temp.length; i++) {
        content.forEach((item) => {
          const firstName = item.name.split(' ')[0].toLowerCase().split('');
          const lastName = item.name.split(' ')[1].toLowerCase().split('');
          const surname = item.name.split(' ')[2].toLowerCase().split('');

          temp[i].includes(firstName[i]) +
          temp[i].includes(lastName[i]) +
          temp[i].includes(surname[i]) ?
           item.display = '' : item.display = 'none';
        });
      }
      break;
    case 'age':
      temp = filter.toString().toLowerCase().split('');

      for (i = 0; i < temp.length; i++) {
        content.forEach((item) => {
          const age = item.age.split('');
          temp[i].includes(age[i]) ? item.display = '' : item.display = 'none';
        });
      }
      break;
    case 'faculty':
      temp = filter.toString().toLowerCase().split('');

      for (i = 0; i < temp.length; i++) {
        content.forEach((item) => {
          const faculty = item.faculty.toLowerCase().split('');
          filter[i].includes(faculty[i]) ? item.display = '' : item.display = 'none';
        });
      }
      break;
    case 'startYear':
      content.forEach((item) => {
        item.startYear == filter ? item.display = '' : item.display = 'none';
      })
      break;
    case 'endYear':
      content.forEach((item) => {
        item.startYear + 3 == filter ? item.display = '' : item.display = 'none';
      })
      break;

    default:
      break;
  }

  tableRender(content);
}

function tableSave(content) {
  const name = document.querySelector('title').innerHTML.replace(' ', '');

  localStorage.setItem(name, JSON.stringify(content));
}

window.addNewStudent = addNewStudent;
