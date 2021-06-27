class Contact {
    constructor (name, number){
        this.name = name;
        this.number = number;
    }
}

class ContactLibrary {
    static getContacts() {
        let contacts;
        if (localStorage.getItem('contacts') === null) {
            contacts = [];
        }
        else {
            contacts = JSON.parse(localStorage.getItem('contacts'));
        }

        return contacts;
    }

    static searchTable(value) {
        var data = [];
        var contacts = ContactLibrary.getContacts();
        contacts.forEach(contact => {
            value = value.toLowerCase();
            var name = contact.name.toLowerCase();

            if (name.includes(value)) {
                data.push(contact);
            }

        })

        return data;
    }

    static addContact(contact) {
        const contacts = ContactLibrary.getContacts();

        contacts.push(contact);

        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    static removeContact(number) {
        const contacts = ContactLibrary.getContacts();

        contacts.forEach((contact, index) => {
            if (contact.number === number) {
                contacts.splice(index, 1);
            }
        });

        localStorage.setItem('contacts', JSON.stringify(contacts));
    }
}

class Interface {
    constructor() {
        alertIsSet: false;
    }

    static displayFilteredData(data) {
        const table = document.querySelector('#phone-book');
        table.innerHTML = '';
        data.forEach(contact => {
            var row = `<tr>
            <td>${contact.name}</td>
            <td>${contact.number}</td>
            <td><contact id="deletebtn" class="btn btn-warning delete"><i class="far fa-trash-alt"></i></button></td>
            </tr>
            `;
            table.innerHTML +=row;
        })
    }

    static displayContacts() {
        const contacts = ContactLibrary.getContacts();

        contacts.forEach((contact) => Interface.addContact(contact));
    }

    static showAlert(mes, className) {
        if (this.alertIsSet) {
            document.querySelector('.alert').style.display = 'none';
            this.alertIsSet = false;
        }
        if (!this.alertIsSet) {
            document.querySelector('.alert').style.display = "flex";
            document.querySelector('.alert').className = `alert alert-${className} w-50 text-center mx-auto`;
            document.querySelector('.alert').innerHTML = mes;
            if (className === "success") {
                setTimeout(() => document.querySelector('.alert').style.display = 'none', 2000);
            }
            else {
                this.alertIsSet = true;
            }
        }
    }

    static addContact(contact) {
        const arr = document.querySelector('#phone-book');
        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${contact.name}</td>
        <td>${contact.number}</td>
        <td><button id="deletebtn" class="btn btn-warning delete"><i class="far fa-trash-alt"></i></button></td>
        `;

        arr.appendChild(row);
    }
    
    static deleteContact(target) {
        if (target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();
        }
    }
    static clearFields() {
        document.querySelector('#name').value = '';
        document.querySelector('#phone').value = '';
    }

    static validateNumber(number) {
        var re = /^\+?([0-9]{2,3})?\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/;
       
        return re.test(number);
    }
}

document.addEventListener('DOMContentLoaded', Interface.displayContacts);

document.querySelector('#form-list').addEventListener('submit', (e) => {
    const name = document.querySelector('#name').value;
    const number = document.querySelector('#phone').value;

    if (name === '' || number === '') {
        Interface.showAlert("Please, fill in all the fields", "warning");
    }
    else if (ContactLibrary.getContacts().filter(contact => contact.name === name).length > 0) {
        Interface.showAlert("The contact with the same name already exists", "warning");
    }
    else if (ContactLibrary.getContacts().filter(contact => contact.number === number).length > 0) {
        Interface.showAlert("The number is already assigned to the contact " + ContactLibrary.getContacts().filter(contact => contact.number === number)[0].name, "warning");
    }
    else if (!Interface.validateNumber(number)) {
        Interface.showAlert("The number is ill formatted", "warning");
    }
    else {
        
        Interface.showAlert("New contact added!", "success");
        const contact = new Contact(name, number);
        Interface.addContact(contact);
        ContactLibrary.addContact(contact);
        Interface.clearFields();
    }

    return false;
});

document.querySelector('#table').addEventListener('click', (e) => {
    e.stopPropagation();
    var btn = e.target.type == 'submit' ? e.target : e.target.parentElement;
    ContactLibrary.removeContact(btn.parentElement.previousElementSibling.textContent);
    Interface.deleteContact(btn);
});


document.querySelector('#search').addEventListener('keyup', function (e) {
    var value = e.target.value;
    var data = ContactLibrary.searchTable(value);
    Interface.displayFilteredData(data);
});