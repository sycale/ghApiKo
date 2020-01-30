import $ from 'jquery';

const goldTier = 25;
const silverTIer = 15;
const bronzeTier = 5;
const goldList = [];
const silverList = [];
const bronzeList = [];
const list = [];
function getContributors(owner, repo) {
  return $.ajax({
    dataType: 'json',
    type: 'GET',
    url: `https://api.github.com/repos/${owner}/${repo}/contributors`,
  });
}

$(document).ready(() => {
  $('#inputButton').click(() => {
    $('.list_content').empty();
    const requestParams = $('#inputText')
      .val()
      .split('/');
    getContributors(requestParams[0], requestParams[1]).then((content) => {
      content.forEach((element) => {
        console.log('test');
        list.push(element);
        if (element.contributions >= bronzeTier && element.contributions < silverTIer) {
          bronzeList.push(element);
        } else if (element.contributions >= silverTIer && element.contributions < goldTier) {
          silverList.push(element);
        } else if (element.contributions >= goldTier) {
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
    $('.list_content').empty();
    list.forEach((element) => {
      $('.list_content').append(
        `<span class = "list_item"><a href = "${element.html_url}">${element.login}</a></span>`,
      );
    });
  });
  $('.gold-tier').click(() => {
    $('.list_content').empty();
    goldList.forEach((element) => {
      $('.list_content').append(
        `<span class = "list_item"><a href = "${element.html_url}">${element.login}</a></span>`,
      );
    });
  });
  $('.silver-tier').click(() => {
    $('.list_content').empty();
    silverList.forEach((element) => {
      $('.list_content').append(
        `<span class = "list_item"><a href = "${element.html_url}">${element.login}</a></span>`,
      );
    });
  });
  $('.bronze-tier').click(() => {
    $('.list_content').empty();
    bronzeList.forEach((element) => {
      $('.list_content').append(
        `<span class = "list_item"><a href = "${element.html_url}">${element.login}</a></span>`,
      );
    });
  });
});
