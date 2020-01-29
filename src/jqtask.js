import $ from 'jquery';

// const xhr = new XMLHttpRequest();

function getContributors(owner, repo) {
  return $.ajax({
    dataType: 'json',
    type: 'GET',
    url: `https://api.github.com/repos/${owner}/${repo}/contributors`,
  });
}

$(document).ready(() => {
  $('#inputButton').click(() => {
    $('.contributors_list').empty();
    const requestParams = $('#inputText')
      .val()
      .split('/');
    getContributors(requestParams[0], requestParams[1]) .then((content) => {
      for (let i = 0; i < content.length; i += 1) {
        $('.contributors_list').append(
          `<span class = "item"><a href = "${content[i].html_url}">${i + 1}: ${
            content[i].login
          }</a></span>`,
        );
      }
    }),
    (errData) => {
      console.log(`${errData.status} ${errData.statusText}`);
    };
  });
});
