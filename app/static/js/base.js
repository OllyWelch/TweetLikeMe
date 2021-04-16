$(function () {    
    set_submit_button();
})

function generate() {
    $('#quote').hide();
    $('#bottom_controls').html('<img id="loading" src="/static/images/loading.gif">');
    let data = localStorage.getItem('text');
    $.post('/api/generate_tweet', {
        text: data
    }).done(function(response) {
        $('#quote').html('<p>' + response + '</p>');
        var generator = '<button onclick="generate();">Generate</button>';
        var back_button = '<button id="back_button" onclick="go_back();">Back</button>';
        $('#bottom_controls').html(generator + back_button);
        $('#quote').fadeIn(500);
    });
}

function go_back() {
    $('.row').hide();
    let heading1 = '<p>Generate tweets like any user on Twitter!</p>'
    let heading2 = '<p>Simply type a valid twitter username to begin...</p>';
    let start_div = '<div id="username">';
    let user_input = '<input id="username_input" autocomplete="off"></input>';
    let submit_button = '<button id="username_submit">Submit</button>';
    let end_div = '</div>';
    let inner_row = heading1 + heading2 + start_div + user_input + submit_button + end_div;
    $('.row').html(inner_row);
    set_submit_button();
    $('.row').fadeIn(1000);
}

function set_row_html(username) {
    $(".row").hide();
    $(".row").load("static/html/inner_row.html");
    $('.row').fadeIn(1000);
    $.ajax('/api/get_profile_image/' + username).done(function(response){
        $('#image_container').html("<img src=" + response + " id='profile_image'>");
    });
}

function set_submit_button() {
    $('#username_submit').click(set_up_generator);
    $('#username_input').keypress(function (e) {
        var key = e.which;
        if(key == 13)  // the enter key code
        {
        $('#username_submit').click();
        return false;  
        }
    });
}

function set_up_generator(){
    var username = $('#username_input').val();
    var loading_image = '<img id="tweets_loading" src="/static/images/ellipsis.gif">';
    var message = '<p id="loading_message">Retrieving tweets, please wait...</p>';
    $('.row').html(message + loading_image);
    if (username === ""){
        search_error();
    }
    else {
        $.ajax('/api/get_tweets/' + username).done(function(data) {
            if (data == "No tweets found") {
                search_error();
            }
            else {
                localStorage.setItem('text', data);
                set_row_html(username);
            }
        });
    }
}

function search_error() {
    var message = "<p>No tweets were found for this user, please try again.<p>"
    message += "<p>Check the account is public, and that you have the correct username!</p><br>"
    var button = "<button onclick='go_back();'>Back</button>"
    $('.row').hide();
    $('.row').html(message + button);
    $('.row').fadeIn(1000);
}