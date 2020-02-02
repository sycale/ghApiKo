import $ from 'jquery';

const silverTIer = 15;
const bronzeTier = 5;
let goldList = [];
let silverList = [];
let bronzeList = [];
let list = [];
let userArr = {};
const fieldsArr = ['#firstName', '#lastName', '#jobRole', '#phone'];
let statusValid;

function getContributors(owner, repo) {
  return $.ajax({
    dataType: 'json',
    type: 'GET',
    url: `https://api.github.com/repos/${owner}/${repo}/contributors`,
  });
}

function getUserInfo(user) {
  return $.ajax({
    dataType: 'json',
    type: 'GET',
    url: `https://api.github.com/users/${user}`,
  });
}

function sort(array, type) {
  if (type === 'asc') {
    array.forEach((arr) => {
      for (let i = 0, endI = arr.length - 1; i < endI; i += 1) {
        for (let j = 0, endJ = endI - i; j < endJ; j += 1) {
          if (arr[j].login[0].toLowerCase() < arr[j + 1].login[0].toLowerCase()) {
            const swap = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = swap;
          }
        }
      }
    });
  } else {
    array.forEach((arr) => {
      for (let i = 0, endI = arr.length - 1; i < endI; i += 1) {
        for (let j = 0, endJ = endI - i; j < endJ; j += 1) {
          if (arr[j].login[0].toLowerCase() > arr[j + 1].login[0].toLowerCase()) {
            const swap = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = swap;
          }
        }
      }
    });
  }
}

function contrSort(array, type) {
  if (type === 'asc') {
    array.forEach((arr) => {
      for (let i = 0, endI = arr.length - 1; i < endI; i += 1) {
        for (let j = 0, endJ = endI - i; j < endJ; j += 1) {
          if (arr[j].contributions > arr[j + 1].contributions) {
            const swap = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = swap;
          }
        }
      }
    });
  } else {
    array.forEach((arr) => {
      for (let i = 0, endI = arr.length - 1; i < endI; i += 1) {
        for (let j = 0, endJ = endI - i; j < endJ; j += 1) {
          if (arr[j].contributions < arr[j + 1].contributions) {
            const swap = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = swap;
          }
        }
      }
    });
  }
}
function replaceList(arr) {
  $('.list_content').empty();
  arr.forEach((element) => {
    getUserInfo(element.login).then(
      (content) => {
        userArr[content.login] = content;
        $('.list_content').append(
          `<div class = "list_item"><span class = "item_login"><a href = "${element.html_url}">${element.login}</a></span>
        <br>
        <span class = "item_company">${content.company}</span>
        <br>
        <span class = "item_email">${content.email}</span>
        <br>
        <span class = "item_location">${content.location}</span>
        <br>
        <input type = "button" id = "editProfile" class = "click-me" value = "edit profile" data-user = "${element.login}">
        </div>`,
        );
      },
      (errData) => {
        console.log(errData);
      },
    );
  });
}

function sortAndReplace() {
  if ($('.sort-type:selected').attr('data-val') === 'alph_a') {
    sort([list, goldList, bronzeList, silverList], 'asc');
  } else if ($('.sort-type:selected').attr('data-val') === 'alph_d') {
    sort([list, goldList, bronzeList, silverList], 'desc');
  } else if ($('.sort-type:selected').attr('data-val') === 'contr_a') {
    contrSort([list, goldList, bronzeList, silverList], 'asc');
  } else if ($('.sort-type:selected').attr('data-val') === 'contr_d') {
    contrSort([list, goldList, bronzeList, silverList], 'desc');
  }
  if ($('.list_content').attr('data-current') === 'all') {
    replaceList(list);
  } else if ($('.list_content').attr('data-current') === 'gold') {
    replaceList(goldList);
  } else if ($('.list_content').attr('data-current') === 'silver') {
    replaceList(silverList);
  } else if ($('.list_content').attr('data-current') === 'bronze') {
    replaceList(bronzeList);
  }
}

function validation() {
  fieldsArr.forEach((ptr) => {
    if ($(ptr).val().length === 0) {
      $(ptr).addClass('warn');
      statusValid = false;
    } else {
      $(ptr).removeClass('warn');
      statusValid = true;
    }
  });
}

function handleModal(user) {
  $('.modal').css('display', 'flex');
  $('.page').css('filter', 'blur(8px)');
  $('#accName').replaceWith(
    `<span class="modal-subtitle" id="accName">${userArr[user].login}</span>`,
  );
  $('#email').replaceWith(`<span class="modal-subtitle" id="email">${userArr[user].email}</span>`);
}

$(document).ready(() => {
  $.ajax({
    url: 'https://api.github.com/rate_limit',
  }).then(
    (data) => {
      console.log(data);
    },
    (errData) => {
      console.log(errData);
    },
  );
  $('#inputButton').click(() => {
    userArr = {};
    list = [];
    goldList = [];
    bronzeList = [];
    silverList = [];
    $('.list_content').empty();
    const requestParams = $('#inputText')
      .val()
      .split('/');
    getContributors(requestParams[0], requestParams[1]).then((content) => {
      content.forEach((element) => {
        list.push(element);
        if (element.contributions <= bronzeTier) {
          bronzeList.push(element);
        } else if (element.contributions <= silverTIer) {
          silverList.push(element);
        } else {
          goldList.push(element);
        }
      });
      $('.all-tier').trigger('click');
    }),
    (errData) => {
      console.log(`${errData.status} ${errData.statusText}`);
    };
  });
  $('.all-tier').click(() => {
    $('.list_content').attr('data-current', 'all');
    replaceList(list);
  });
  $('.gold-tier').click(() => {
    $('.list_content').attr('data-current', 'gold');
    replaceList(goldList);
  });
  $('.silver-tier').click(() => {
    $('.list_content').attr('data-current', 'silver');
    replaceList(silverList);
  });
  $('.bronze-tier').click(() => {
    $('.list_content').attr('data-current', 'bronze');
    replaceList(bronzeList);
  });
  $('.sort_main').on('change', () => {
    sortAndReplace();
  });
  $(document).on('click', '#editProfile', (elem) => {
    handleModal($(elem.target).attr('data-user'));
  });
  $(document).on('click', '.btn', () => {
    validation();
    if (statusValid) {
      $('.modal').css('display', 'none');
      $('.page').css('filter', 'none');
      $('.modal-input').val('');
    }
  });
});
