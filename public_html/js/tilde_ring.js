// var ts = 'json/othertildes.json';
// var us = 'http://tilde.town/~dan/users.json';

function link_tilde_ring() {
    link_random_tildebox();
    link_random_user();
}

// get ~user (minus ~)
function user() {
    return window.location.pathname.split('/')[1].split('~')[1];
}

// TODO: serve othertildes.json in JSONP so that this scripts can just be
//       dropped into any page.
function link_random_tildebox() {
    $.getJSON('http://tilde.town/~um/json/othertildes.json', function(data) {
        var urls = normalize_tilde_urls( obj_values(data) ),
            random_tildebox = random_item(urls);

        $('#random_tildebox').attr('href', random_tildebox);
    });
}

// TODO: get tildes to store user JSON in standard location? Then the
//       `json` arg here could be omitted in lieu of a relative address
//       in hard coded in the funciotn body: e.g., '/users.json'.
function link_random_user() {
    var user_list = $('#tilde_ring').attr('userlist');

    $.getJSON(user_list, function(users) {
        delete users[user()];
        var urls = obj_values(users).map(function(o) { return o.homepage; }),

            random_user = random_item(urls);
        
        $('#random_user').text("Visit a Random " + window.location.hostname + " ~user");
        $('#random_user').attr('href', random_user);
    });
}

// Object {key:values} -> Array [values]
function obj_values(obj) {
    var values = [];
    for(var key in obj) {
        if (obj.hasOwnProperty(key)) {
            values.push(obj[key]);
        }
    }
    return values;
}

function random_item(items) {
    return items[Math.floor(Math.random()*items.length)];
}

// "normalizing" here means removing traling slashes and
// removing the host from the array

function normalize_tilde_urls(urls) {
    urls.push('http://tilde.club');     // compensating for tilde.club's club-centricism ;)

    function last(array) {
        return array[array.length - 1];
    }    

    function trim_trailing_slash(string) {
        return ( (last(string) == "/")
                 ? string.slice(0, length-1)
                 : string
               );
    }

    var trimmed_urls  = urls.map(trim_trailing_slash),
        host_tildebox = window.location.hostname;

    function remove(array, x) {
        var index = array.indexOf(x);
        if ( index > -1 ) {
            array.splice(index, 1);
        };
        return array;
    }

    return remove(trimmed_urls, host_tildebox);
}

// main function, to run when script loads.
link_tilde_ring();
