const bodyCustomer = $("#tbCustomer tbody");
const btnCreate = $("#btnCreate");
const btnUpdate = $("#btnUpdate");
const btnDeposit = $("#btnDeposit");
const btnWithdraw = $("#btnWithdraw");
const btnTransfer = $("#btnTransfer");
const btnDelete =$("#btnDelete");

const loading = $("#loading");

const toastLive = $("#liveToast");
const toastBody = $("#toast-body");
const btnCloseToast = $("#btnCloseToast");

const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive);

let personId = 0;

async function fetchALlPerson() {
  return await $.ajax({
    url: "http://localhost:3300/persons",
  });
}

const getALlPerson = async () => {
  const persons = await fetchALlPerson();

  persons.forEach((item) => {
    const str = renderPerson(item);
    // bodyCustomer.innerHTML += str;
    bodyCustomer.prepend(str);
  });

  const btnEditElems = $(".edit");

  $.each(btnEditElems, (index, item) => {
    $(item).on("click", async () => {
      // const id = item.id.replace('data_', '')
      personId = $(item).data("id");

      const person = await getPersonById(personId);
      // console.log(person);

      // openModal('modalUpdate')
      $("#modalUpdate").modal("show");

      $("#fullNameUp").val(person.fullName);
      $("#emailUp").val(person.email);
      $("#phoneUp").val(person.phone);
      $("#addressUp").val(person.address);
    });
  });

  const btnDepositElems = $(".deposit");

  $.each(btnDepositElems, (index, item) => {
    $(item).on("click", async () => {
      personId = $(item).data("id");

      const person = await getPersonById(personId);

      $("#modalDeposit").modal("show");

      $("#fullNameDe").val(person.fullName);
      $("#emailDe").val(person.email);
      $("#balanceDe").val(person.balance);
    });
  });

  const btnWithdrawElems = $(".withdraw");
  $.each(btnWithdrawElems, (index, item) => {
    $(item).on("click", async () => {
      personId = $(item).data("id");

      const person = await getPersonById(personId);

      $("#modalWithdraw").modal("show");

      $("#fullNameWi").val(person.fullName);
      $("#emailWi").val(person.email);
      $("#balanceWi").val(person.balance);
    });
  });

  const btnTransferElems = $(".transfer");
  $.each(btnTransferElems, (index, item) => {
    $(item).on("click", async () => {
      personId = $(item).data("id");

      const person = await getPersonById(personId);

      $("#modalTransfer").modal("show");

      $("#senderId").val(person.id);
      $("#senderName").val(person.fullName);
      $("#senderEmail").val(person.email);
      $("#senderBalance").val(person.balance);
      $("#recipientId").html(await renderOption(personId));
    });
  });
};

const transferAmountElem = document.getElementById("transferAmount");
const transactionAmountElem = document.getElementById("transactionAmount");

transferAmountElem.addEventListener("input", function () {
    const transferAmount = +this.value;

    const fees = 10;
    const feesAmount = transferAmount * fees / 100;

    transactionAmountElem.value = transferAmount + feesAmount;

})

async function renderOption(id) {
    const customers = await fetchALlPerson();
    var customersWithout = [];
    customers.forEach(element => {
        if(element.id !== id){
            customersWithout.push(element);
        }
    });
    console.log(customersWithout);
    var strOption ='';
    customersWithout.forEach(element => {
        strOption += `<option value="${element.id}"> ${element.id} - ${element.fullName}</option>`
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
                        <button class="btn btn-outline-success deposit" data-id="${obj.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-outline-warning withdraw" data-id="${obj.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-outline-primary transfer" data-id="${obj.id}">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-outline-danger " id="btnDelete" data-id="${obj.id}" onclick="return confirm('Do you want remove ${obj.fullName} ?')">
                            <i class="fas fa-ban"></i>
                        </button>
                    </td>
                </tr>
            `;
};

$("#modalCreate").on("hidden.bs.modal", () => {
  $("#frmCreate").trigger("reset");
  $("#frmCreate input").removeClass("error");
  $("#frmCreate label.error").remove();
});

$("#frmCreate").validate({
  rules: {
    fullNameCre: {
      required: true,
    },
  },
  messages: {
    fullNameCre: {
      required: "FullName is required",
    },
  },
  submitHandler: () => {
    createCustomer();
  },
});

//create
const createCustomer = () => {
  const fullName = $("#fullNameCre").val();
  const email = $("#emailCre").val();
  const phone = $("#phoneCre").val();
  const address = $("#addressCre").val();
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

  btnCreate.prop("disabled", true);

  loading.removeClass("hide");

  setTimeout(() => {
    $.ajax({
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      method: "POST",
      url: "http://localhost:3300/persons",
      data: JSON.stringify(obj),
    })
      .done((data) => {
        const str = renderPerson(data);
        bodyCustomer.prepend(str);

        closeModal("modalCreate");

        toastBody.text("Thêm mới thành công");
        toastBootstrap.show();
        attachEvents();
        setTimeout(() => {
          btnCloseToast.click();
        }, 2000);
      })
      .always(() => {
        btnCreate.prop("disabled", false);
        loading.addClass("hide");
      });
  }, 2000);
};

btnCreate.on("click", async () => {
  $("#frmCreate").trigger("submit");
});

//delete
// const deleteCustomer = async (id) => {
//   const response = await fetch("http://localhost:3300/customers/" + id, {
//       method: 'DELETE',
//       headers: {
//           "Content-type": "application/json; charset=UTF-8"
//       },
//   });
//   const person = await response.json();
// }

//update
btnUpdate.on("click", async () => {
  const fullName = $("#fullNameUp").val();
  const email = $("#emailUp").val();
  const phone = $("#phoneUp").val();
  const address = $("#addressUp").val();
  const obj = {
    fullName,
    email,
    phone,
    address,
  };

  const content = await fetchUpdatePerson(personId, obj);

  const updateRow = $("#tr_" + personId);
  const str = renderPerson(content);
  updateRow.replaceWith(str);

  closeModal("modalUpdate");

  toastBody.text("Cập nhật thông tin thành công");
  toastBootstrap.show();
  attachEvents();
});

//deposit

btnDeposit.on("click", async () => {
  const balance = parseFloat($("#balanceDe").val());
  const transaction = parseFloat($("#transactionDe").val());
  const newBalance = balance + transaction;
  const obj = {
    balance: newBalance,
  };
  const content = await fetchUpdatePerson(personId, obj);

  const updateRow = $("#tr_" + personId);
  const str = renderPerson(content);
  updateRow.replaceWith(str);

  closeModal("modalDeposit");

  toastBody.text("Nạp tiền thành công");
  toastBootstrap.show();

  attachEvents();

  $("#frmDeposit").trigger("reset");
});
//withdraw
btnWithdraw.on("click", async () => {
  const balance = parseFloat($("#balanceWi").val());
  const transaction = parseFloat($("#transactionWi").val());
  const newBalance = balance - transaction;
  const obj = {
    balance: newBalance,
  };
  const content = await fetchUpdatePerson(personId, obj);

  const updateRow = $("#tr_" + personId);
  const str = renderPerson(content);
  updateRow.replaceWith(str);

  closeModal("modalWithdraw");

  toastBody.text("Rút tiền thành công");
  toastBootstrap.show();

  attachEvents();

  $("#frmWithdraw").trigger("reset");
});
//transfer
btnTransfer.on("click", async () => {
  const senderName=$("#senderName").val();
  const balance = parseFloat($("#senderBalance").val());
  const transferAmount = parseFloat($("#transferAmount").val());
  const transactionAmount= parseFloat($("#transactionAmount").val());
 const fee =10;
const dateTransfer =Date.now;
  const recipientSelect = $("#recipientId").val();
  const recipientIdValue = await getPersonById(recipientSelect);
  const RecipientId = recipientIdValue.id;
  const recipientName=recipientIdValue.fullName;
  const balanceRecipient = parseFloat(recipientIdValue.balance);

  const newBalanceRecipient = balanceRecipient + transferAmount;
  const newBalanceSender = balance - transactionAmount;

  const his={
    senderName,
    recipientName,
    transferAmount,
    fee,
    transactionAmount,
    dateTransfer,
  };

  const obj = {
    balance: newBalanceSender,
  };
  const db = {
    balance: newBalanceRecipient,
  };

  $.ajax({
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    method: "POST",
    url: "http://localhost:3300/transfers",
    data: JSON.stringify(his),
  })

  const content = await fetchUpdatePerson(personId, obj);
  const  contentRecipient = await fetchUpdatePerson(RecipientId, db);

  const updateRow = $("#tr_" + personId);
  const str = renderPerson(content);
  updateRow.replaceWith(str);

  const update = $("#tr_" + RecipientId);
  const render = renderPerson(contentRecipient);
  update.replaceWith(render);

  closeModal("modalTransfer");

  toastBody.text("Chuyển tiền thành công");
  toastBootstrap.show();

  attachEvents();

  $("#frmTransfer").trigger("reset");
});


//render các nút
function attachEvents() {
  const btnEditElems = $(".edit");

  $.each(btnEditElems, (index, item) => {
    $(item).on("click", async () => {
      personId = $(item).data("id");

      const person = await getPersonById(personId);

      $("#modalUpdate").modal("show");

      $("#fullNameUp").val(person.fullName);
      $("#emailUp").val(person.email);
      $("#phoneUp").val(person.phone);
      $("#addressUp").val(person.address);
    });
  });

  const btnDepositElems = $(".deposit");

//   btnDepositElems.off("click");

  $.each(btnDepositElems, (index, item) => {
    $(item).on("click", async () => {
      personId = $(item).data("id");

      const person = await getPersonById(personId);

      $("#modalDeposit").modal("show");

      $("#fullNameDe").val(person.fullName);
      $("#emailDe").val(person.email);
      $("#balanceDe").val(person.balance);
    });
  });

  const btnWithdrawElems = $(".withdraw");
//   btnWithdrawElems.off("click");
  $.each(btnWithdrawElems, (index, item) => {
    $(item).on("click", async () => {
      personId = $(item).data("id");

      const person = await getPersonById(personId);

      $("#modalWithdraw").modal("show");

      $("#fullNameWi").val(person.fullName);
      $("#emailWi").val(person.email);
      $("#balanceWi").val(person.balance);
    });
  });

  const btnTransferElems = $(".transfer");
  $.each(btnTransferElems, (index, item) => {
    $(item).on("click", async () => {
      personId = $(item).data("id");

      const person = await getPersonById(personId);

      $("#modalTransfer").modal("show");

      $("#senderId").val(person.id);
      $("#senderName").val(person.fullName);
      $("#senderEmail").val(person.email);
      $("#senderBalance").val(person.balance);
      $("#recipientId").html(await renderOption(personId));
    });
  });

  setTimeout(() => {
    btnCloseToast.click();
  }, 2500);
}

// function openModal(elem) {
//     let el = document.getElementById(elem);
//     new bootstrap.Modal(el).show();
// }

function closeModal(elem) {
  document.getElementById(elem).style.display = "none";
  document.getElementById(elem).classList.remove("show");
  document.querySelector(".modal-backdrop").remove();
  document.querySelector("body").setAttribute("style", "overflow: none");
}

getALlPerson();
