//LocalStorage Aux
Storage.prototype.setObj = function(key, obj) {
  return this.setItem(key, JSON.stringify(obj));
};
Storage.prototype.getObj = function(key) {
  return JSON.parse(this.getItem(key));
};

//=====Main=====
lS = window.localStorage;
drawList();

$("#bookmark-form").submit(function(e) {
  e.preventDefault();

  let name = $("#name");
  let url = $("#url");

  if (name.val() == "" || name.val() == " ") {
    notice("error", "Site name is invalid!");
    return;
  }

  if (!validateURL(url.val())) {
    notice("error", "URL is invalid!");
    return;
  }
  appendToList({ name: name.val(), url: url.val() });
  drawList();
  notice("add",'<b>'+ name.val() + "</b> Added");
});

//=====/Main/=====

//Aux

function drawList() {
  $("#bookmark-list tr").remove();
  lS.getObj("bm").forEach(data => {
    let row = $('<tr></tr>');
    $(`<td>${data.name}</td>`).appendTo(row);
    $(
      `<td><a href="${data.url}" target="_blank">${data.url}</a></td>`
    ).appendTo(row);

    let button = $('<button class="btn btn-danger my-1"> &#10008 </button>');
    button.click(() => {
      deltedFromList(data.id);
      drawList();
      notice("delete",'<b>'+ data.name + "</b> Deleted");
    });
    button.appendTo($('<td class="text-center align-middle"></td>')).appendTo(row);

    row.appendTo($("table tbody"));
    
    $('.fade-tr').css('opacity',"1")
  });
}

timeouts = [];
function notice(type, msg) {
  timeouts.forEach(clearTimeout);
  $("#notice").css("opacity", "1");
  $("#notice").html(msg);
  switch (type) {
    case "error":
      $("#notice").css("background-color", "red");
      break;
    case "add":
      $("#notice").css("background-color", "green");
      break;
    case "delete":
      $("#notice").css("background-color", "orange");
      break;
    default:
      $("#notice").css("background-color", "teal");
  }
  timeouts.push(
    setTimeout(() => {
      $("#notice").css("opacity", "0");
    }, 1500)
  );
}

function validateURL(url) {
  return /^(ftp|http|https):\/\/[^ "]+$/.test(url);
}

function appendToList(data) {
  if (lS.getObj("bm") == null) lS.setObj("bm", []);
  let arr = lS.getObj("bm");
  let maxId = 0;
  arr.forEach(elem => {
    if (elem.id > maxId) maxId = elem.id;
  })
  data.id = maxId+1;
  arr.push(data);
  lS.setObj("bm", arr);
}

function deltedFromList(id) {
  if (lS.getObj("bm") == null) return;
  let arr = lS.getObj("bm");
  let tarIndex = -1;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id == id) {
      tarIndex = i;
      break;
    }
  }
  arr.splice(tarIndex, 1);
  lS.setObj("bm", arr);
}
