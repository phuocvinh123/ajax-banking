const bodyCustomer = document.querySelector("#tbCustomer tbody");
const btnCreate = document.getElementById("btnCreate");
const btnUpdate = document.getElementById("btnUpdate");
const btnDeposit = document.getElementById("btnDeposit");
const btnWithdraw = document.getElementById("btnWithdraw");
const btnTransfer = document.getElementById("btnTransfer");

const toastLive = document.getElementById("liveToast");
const toastBody = document.getElementById("toast-body");
const btnCloseToast = document.getElementById("btnCloseToast");

const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive);

let personId = 0;

async function fetchALlPerson() {
  const response = await fetch("http://localhost:3300/persons");
  const persons = await response.json();
  return persons;
}

const getALlPerson = async () => {
  const persons = await fetchALlPerson();
  console.log(persons);

  persons.forEach((item) => {
    const str = renderPerson(item);
    bodyCustomer.innerHTML += str;
  });

  const btnEditElems = document.querySelectorAll(".edit");

  btnEditElems.forEach((item) => {
    item.addEventListener("click", async () => {
      personId = item.getAttribute("data-id");

      const person = await getPersonById(personId);

      openModal("modalUpdate");

      document.getElementById("fullNameUp").value = person.fullName;
      document.getElementById("emailUp").value = person.email;
      document.getElementById("phoneUp").value = person.phone;
      document.getElementById("addressUp").value = person.address;
    });
  });

  const btnDepositElems = document.querySelectorAll(".deposit");

  btnDepositElems.forEach((item) => {
    item.addEventListener("click", async () => {
      personId = item.getAttribute("deposit-id");

      const person = await getPersonById(personId);

      openModal("modalDeposit");

      document.getElementById("fullNameDe").value = person.fullName;
      document.getElementById("emailDe").value = person.email;
      document.getElementById("balanceDe").value = person.balance;
      document.getElementById("transactionDe").value = "";
    });
  });

  const btnWithdrawElems = document.querySelectorAll(".withdraw");

  btnWithdrawElems.forEach((item) => {
    item.addEventListener("click", async () => {
      personId = item.getAttribute("withdraw-id");

      const person = await getPersonById(personId);

      openModal("modalWithdraw");

      document.getElementById("fullNameWi").value = person.fullName;
      document.getElementById("emailWi").value = person.email;
      document.getElementById("balanceWi").value = person.balance;
      document.getElementById("transactionWi").value = "";
    });
  });

  const btnTransferElems = document.querySelectorAll(".transfer");

  btnTransferElems.forEach((item) => {
    item.addEventListener("click", async () => {
      personId = item.getAttribute("transfer-id");

      const person = await getPersonById(personId);

      openModal("modalTransfer");

      document.getElementById("senderId").value = person.id;
      document.getElementById("senderName").value = person.fullName;
      document.getElementById("senderEmail").value = person.email;
      document.getElementById("senderBalance").value = person.balance;
      document.getElementById("recipientSelect").innerHTML = await renderOption(
        personId
      );
      document.getElementById("transactionAmount").value = "";
    });
  });
};

const transferAmountElem = document.getElementById("transferAmount");
const transactionAmountElem = document.getElementById("transactionAmount");

transferAmountElem.addEventListener("input", function () {
  const transferAmount = +this.value;

  const fees = 10;
  const feesAmount = (transferAmount * fees) / 100;

  transactionAmountElem.value = transferAmount + feesAmount;
});

const recipientSelect = document.querySelector('select[name="recipientId"]');

async function renderOption(id) {
  const customers = await fetchALlPerson();
  var customersWithout = [];
  customers.forEach((element) => {
    if (element.id !== id) {
      customersWithout.push(element);
    }
  });
  console.log(customersWithout);
  var strOption = "";
  customersWithout.forEach((element) => {
    strOption += `<option value="${element.id}"> ${element.id} - ${element.fullName}</option>`;
  });
  return strOption;
}

const getPersonById = async (personId) => {
  const response = await fetch("http://localhost:3300/persons/" + personId);
  const person = await response.json();
  return person;
};

const fetchUpdatePerson = async (personId, obj) => {
  const response = await fetch("http://localhost:3300/persons/" + personId, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(obj),
  });
  const person = await response.json();
  return person;
};

const renderPerson = (obj) => {
  return `
                <tr id="tr_${obj.id}">
                    <td>${obj.id}</td>
                    <td>${obj.fullName}</td>
                    <td>${obj.email}</td>
                    <td>${obj.phone}</td>
                    <td>${obj.address}</td>
                    <td>${obj.balance}</td>
                    <td>
                        <button class="btn btn-outline-secondary edit" id="data_${obj.id}" data-id="${obj.id}">
                            <i class="far fa-edit"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-outline-success deposit" deposit-id="${obj.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-outline-warning withdraw" withdraw-id="${obj.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-outline-primary transfer" transfer-id="${obj.id}">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                    </td>
                    <td>
                         <button class="btn btn-outline-danger" 
                        onclick="deleteCustomerConfirmation(${obj.id}, '${obj.fullName}')">
                        <i class="fas fa-ban"></i>
                       </button>
                       </td>
                </tr>
            `;
};

function deleteCustomerConfirmation(id, fullName) {
  if (confirm(`Do you want to remove ${fullName}?`)) {
    deleteCustomer(id);
  }
}

const deleteCustomer = async (id) => {
  const response = await fetch("http://localhost:3300/persons/" + id, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const person = await response.json();
};

btnCreate.addEventListener("click", async () => {
  const fullName = document.getElementById("fullNameCre").value;
  const email = document.getElementById("emailCre").value;
  const phone = document.getElementById("phoneCre").value;
  const address = document.getElementById("addressCre").value;
  const balance = 0;
  const deleted = 0;

  const obj = {
    fullName,
    email,
    phone,
    address,
    balance,
    deleted,
  };

  const rawResponse = await fetch("http://localhost:3300/persons", {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(obj),
  });

  const content = await rawResponse.json();

  const str = renderPerson(content);
  bodyCustomer.innerHTML += str;

  closeModal("modalCreate");
});

btnUpdate.addEventListener("click", async () => {
  const fullName = document.getElementById("fullNameUp").value;
  const email = document.getElementById("emailUp").value;
  const phone = document.getElementById("phoneUp").value;
  const address = document.getElementById("addressUp").value;

  const obj = {
    fullName,
    email,
    phone,
    address,
  };

  const content = await fetchUpdatePerson(personId, obj);

  const updateRow = document.getElementById("tr_" + personId);
  const str = renderPerson(content);
  updateRow.innerHTML = str;

  closeModal("modalUpdate");

  toastBody.innerText = "Cập nhật thông tin thành công";
  toastBootstrap.show();

  setTimeout(() => {
    btnCloseToast.click();
  }, 2500);
});

btnDeposit.addEventListener("click", async () => {
  const balance = parseFloat(document.getElementById("balanceDe").value);
  const transaction = parseFloat(
    document.getElementById("transactionDe").value
  );

  const newBalance = balance + transaction;

  const obj = {
    balance: newBalance,
  };

  const content = await fetchUpdatePerson(personId, obj);

  const updateRow = document.getElementById("tr_" + personId);
  const str = renderPerson(content);
  updateRow.innerHTML = str;

  closeModal("modalDeposit");

  toastBody.innerText = "Gửi tiền thành công";
  toastBootstrap.show();

  setTimeout(() => {
    btnCloseToast.click();
  }, 2500);
});

btnWithdraw.addEventListener("click", async () => {
  const balance = parseFloat(document.getElementById("balanceWi").value);
  const transaction = parseFloat(
    document.getElementById("transactionWi").value
  );

  const newBalance = balance - transaction;

  const obj = {
    balance: newBalance,
  };

  const content = await fetchUpdatePerson(personId, obj);

  const updateRow = document.getElementById("tr_" + personId);
  const str = renderPerson(content);
  updateRow.innerHTML = str;

  closeModal("modalWithdraw");

  toastBody.innerText = "Rút tiền thành công";
  toastBootstrap.show();

  setTimeout(() => {
    btnCloseToast.click();
  }, 2500);
});

btnTransfer.addEventListener("click", async () => {
  const balance = parseFloat(document.getElementById("senderBalance").value);
  const transferAmount = parseFloat(
    document.getElementById("transferAmount").value
  );
  const transactionAmount = parseFloat(
    document.getElementById("transactionAmount").value
  );
  const recipientSelect = document.getElementById("recipientSelect");
  const selectedValue = recipientSelect.value;
  const recipientIdValue = await getPersonById(selectedValue);
  const RecipientId = recipientIdValue.id;
  const balanceRecipient = parseFloat(recipientIdValue.balance);

  const newBalanceRecipient = balanceRecipient + transferAmount;
  const newBalanceSender = balance - transactionAmount;

  const obj = {
    balance: newBalanceSender,
  };

  const db = {
    balance: newBalanceRecipient,
  };

  const content = await fetchUpdatePerson(personId, obj);
  const  contentRecipient = await fetchUpdatePerson(RecipientId, db);
  const updateRow = document.getElementById("tr_" + personId);
  const str = renderPerson(content);
  updateRow.innerHTML = str;

  const updateRow1 = document.getElementById("tr_" + RecipientId);
  const str1 = renderPerson(contentRecipient);
  updateRow1.innerHTML = str1;

  closeModal("modalTransfer");

  toastBody.innerText = "Chuyển tiền thành công";
  toastBootstrap.show();

  setTimeout(() => {
    btnCloseToast.click();
  }, 2500);
});

function openModal(elem) {
  let el = document.getElementById(elem);
  new bootstrap.Modal(el).show();
}

function closeModal(elem) {
  document.getElementById(elem).style.display = "none";
  document.getElementById(elem).classList.remove("show");
  document.querySelector(".modal-backdrop").remove();
  document.querySelector("body").setAttribute("style", "overflow: none");
}

getALlPerson();
