import $ from 'jquery';

// const xhr = new XMLHttpRequest();

$(document).ready(() => {
  $('#inputButton').click(() => {
    $('.contributors_list').empty();
    const str = $('#inputText')
      .val()
      .split('/');
    // xhr.open(
    //   "GET",
    //   `https://api.github.com/repos/${str[0]}/${str[1]}/contributors`,
    //   false
    // );

    // xhr.send();
    $.ajax({
      dataType: 'json',
      type: 'GET',
      url: `https://api.github.com/repos/${str[0]}/${str[1]}/contributors`,
      success(data) {
        for (let i = 0; i < data.length; i += 1) {
          $('.contributors_list').append(
            `<span class = "item"><a href = "${data[i].html_url}">${i + 1}: ${
              data[i].login
            }</a></span>`,
          );
        }
      },
    });
  });
});
