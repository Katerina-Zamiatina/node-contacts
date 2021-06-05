const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { mainModule } = require('process');

const contactsPath = path.join(__dirname, '/db', './contacts.json');

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, 'utf8');

    const contactsList = JSON.parse(data);

    return console.table(contactsList);
  } catch (error) {
    console.error(error.message);
  }
}

async function getContactById(contactId) {
  try {
    const data = await fs.readFile(contactsPath, 'utf8');
    const contacts = JSON.parse(data);

    const contact = contacts.filter(
      contact => Number(contactId) === contact.id,
    );

    return console.table(contact);
  } catch (error) {
    console.error(error.message);
  }
}

async function removeContact(contactId) {
  try {
    const data = await fs.readFile(contactsPath, 'utf8');
    const contacts = JSON.parse(data);

    const contactName = contacts
      .map(({ id, name }) => {
        if (contactId === id) {
          console.dir(name);
          return name;
        }
      })
      .filter(name => name);

    const newContacts = contacts.filter(contact => contactId != contact.id);

    await fs.writeFile(contactsPath, JSON.stringify(newContacts));

    console.table(newContacts);
    console.log(`Contact ${contactName} was succesfully deleted!`);
  } catch (error) {
    console.error(error.message);
  }
}

async function addContact(name, email, phone) {
  const newContact = {
    id: uuidv4(),
    name,
    email,
    phone,
  };
  try {
    const data = await fs.readFile(contactsPath, 'utf8');
    const parsedContacts = JSON.parse(data);

    const contacts = [...parsedContacts, newContact];

    await fs.writeFile(contactsPath, JSON.stringify(contacts));

    console.table(contacts);
    console.log(`${newContact.name} was succesfully added`);
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
