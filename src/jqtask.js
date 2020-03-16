import $ from 'jquery';
import ko from 'knockout';

const silverTIer = 15;
const bronzeTier = 5;
const contributors = ko.observableArray([]);
const userModal = {
  login: ko.observable(),
  fname: ko.observable(),
  sname: ko.observable(),
  email: ko.observable(),
  job: ko.observable(),
  number: ko.observable(),
};
let statusValid = false;
const fieldsArr = ['#firstName', '#lastName', '#jobRole', '#phone'];

function sortList(dir) {
  contributors.sort((left, right) => (left.login.toUpperCase() == right.login.toUpperCase()
    ? 0
    : left.login.toUpperCase() < right.login.toUpperCase()
      ? -1
      : 1));
  if (dir === 'DESC') {
    contributors.reverse();
  }
}

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

function showGroups(group) {
  if (group === 'all') {
    $('.list_item').removeClass('d-none');
  } else if (group === 'gold') {
    $('.list_item').each((index, element) => {
      $(element).addClass('d-none');
      if ($(element).attr('data-contr') > silverTIer) {
        $(element).removeClass('d-none');
      }
    });
  } else if (group === 'silver') {
    $('.list_item').each((index, element) => {
      $(element).addClass('d-none');
      if ($(element).attr('data-contr') > bronzeTier) {
        $(element).removeClass('d-none');
      }
    });
  } else if (group === 'bronze') {
    $('.list_item').each((index, element) => {
      $(element).addClass('d-none');
      if ($(element).attr('data-contr') < bronzeTier) {
        $(element).removeClass('d-none');
      }
    });
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
  $('.page').css('filter', 'blur(8px)');
  $('.modal').removeClass('d-none');
  getUserInfo(user).then(
    (data) => {
      userModal.login(data.login);
      userModal.sname(data.name.split(' '[1]));
      userModal.fname(data.name.split(' ')[0]);
      userModal.job(data.company);
      userModal.number(data.id);
      userModal.email(data.email);
    },
    (errData) => {
      console.log(errData);
    },
  );
}

$('#inputButton').click(() => {
  getContributors(
    $('#inputText')
      .val()
      .split('/')[0],
    $('#inputText')
      .val()
      .split('/')[1],
  ).then(
    (data) => {
      data.forEach((element) => {
        contributors.push(element);
      });
      ko.applyBindings({ modal: userModal, contributors });
    },
    (errData) => {
      console.log(errData);
    },
  );
});

$(document).on('click', '.click-me', (e) => {
  handleModal($(e.target).attr('data-user'));
});

$('.title_item').click((e) => {
  showGroups($(e.target).attr('data-group'));
});

$('.sort_main').on('change', () => {
  sortList($('.sort-type:selected').attr('data-val'));
});

$(document).on('click', '.btn', () => {
  validation();
  if (statusValid) {
    $('.modal').addClass('d-none');
    $('.page').css('filter', 'none');
    $('.modal-input').val('');
  }
});
