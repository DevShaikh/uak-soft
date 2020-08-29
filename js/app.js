class Person {
  constructor(id, name, guage, weight, bill) {
    this.id = id;
    this.name = name;
    this.guage = guage;
    this.weight = weight;
    this.bill = bill;
  }
}

class UI {

  addWork(work) {
    const list = document.getElementById('work-list');
    // Creat tr element
    const row = document.createElement('tr');
    // Insert Cols
    row.innerHTML = `
      <th scope="col">${work.id}</th>
      <td>${work.name}</td>
      <td>${work.guage}</td>
      <td>${work.weight}</td>
      <td>${work.bill.toFixed(2)}</td>
      <td><button type="button" class="close text-center" aria-label="Close">
      <span class="delete" aria-hidden="true">&times;</span>
      </button></td>
      `;
  
    list.appendChild(row);
  }

  removeWork(target) {
    // Instantiate UI
    const ui = new UI();

    if(target.className === 'delete') {
      if(confirm('Are you sure you want to delete your work!')) {
        // Remove from UI
        target.parentElement.parentElement.parentElement.remove();

        // Remove work to Local Storage
        Store.removeWork(target.parentElement.parentElement.parentElement.firstElementChild.innerHTML);

        // Remove alert
        ui.alertMessage('Work has been deleted!', 'alert-success')
      }
    }  
  }

  clearWorks() {
    // Instantiate UI
    const ui = new UI();

    const list = document.getElementById('work-list');
    if(list.innerHTML === '') {
      ui.alertMessage('Please add work before clear!', 'alert-danger')
    } else {
      while(list.firstChild) {
        list.firstChild.remove();
      }
      ui.alertMessage('Works has been cleared!', 'alert-success')
    }
  }

  alertMessage(msg, className) {
    // Create alert
    const alertUI = document.createElement('div');
    alertUI.className = `alert ${className}`;
    alertUI.innerHTML = `
    ${msg}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>`;

    // Get Parent
    const wrapper = document.getElementById('form-parent');

    // Get Child
    const child = document.getElementById('dataInput');

    // Insert Alert
    wrapper.insertBefore(alertUI, child);

    // Set timeout
    setTimeout(() => {
      alertUI.remove()
    }, 3000)
  }

  clearInputs() {
    document.getElementById('nameDrop').selectedIndex = 0;
    document.getElementById('guageDrop').selectedIndex = 0;
    document.getElementById('weight').value = '';
  }
}

class Store {

  static getWorks() {
    let works;
    if(localStorage.getItem('works') === null) {
      works = [];
    } else {
      works = JSON.parse(localStorage.getItem('works'))
    }
    return works;
  }

  static displayWorks() {
    const works = Store.getWorks();
    const ui = new UI;
    works.forEach(work => {
      ui.addWork(work);
    })
  }

  static addWork(work) {
    const works = Store.getWorks();
    works.push(work);
    localStorage.setItem('works', JSON.stringify(works));
  }

  static removeWork(id) {
    const works = Store.getWorks();
    works.forEach((work, index) => {
      if(work.id === parseInt(id)) {
        works.splice(index, 1);
      }
    });
    localStorage.setItem('works', JSON.stringify(works));
  }

  static clearWorks() {
    localStorage.clear();
  }
}

// EVENT LISTENERS

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayWorks);

// Add Work
document.getElementById('dataInput').addEventListener('submit', e => {
  // Get Values
  const nameUI = document.getElementById('nameDrop'),
        guageUI = document.getElementById('guageDrop'),
        weightUI = document.getElementById('weight'),
        nameIndex = nameUI.options.selectedIndex,
        guageIndex = guageUI.options.selectedIndex,
        name = nameUI.options[nameIndex].value,
        guage = guageUI.options[guageIndex].textContent,
        weight = weightUI.value,
        bill = (guageUI.options[guageIndex].value / 1000) * weight;
  
  // Init UI
  const ui = new UI;

  // Generate ID
  const id = Store.getWorks().length + 1;
  // Instantiate Work
  const work = new Person(id, name, guage, weight, bill);

  if(nameIndex === 0 || guageIndex === 0 || weight === '') {
    // Error Alert
    ui.alertMessage('Please fill in all fields', 'alert-danger')
  } else {
    // Remove add to UI
    ui.addWork(work)
    
    // Add work to Local Storage
    Store.addWork(work);
    
    // Clear fields
    ui.clearInputs();

    // Added alert
    ui.alertMessage('Work Added!', 'alert-success')
  }

  e.preventDefault();
});

// Remove work
document.getElementById('resultArea').addEventListener('click', e => {
  // Instantiate UI
  const ui = new UI;

  // Remove work from UI
  ui.removeWork(e.target);

  // Clear fields
  ui.clearInputs();
});

// Clear all works
document.getElementById('clearWorks').addEventListener('click', e => {
  const ui = new UI;
  // Clear works from UI
  ui.clearWorks();
  // Clear works from Local Storage
  Store.clearWorks();
});
