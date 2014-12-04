var tildeboxlist_urls = 'http://tilde.town/~um/json/othertildes.json';
// var userlist_url = 'http://tilde.town/~dan/users.json';
var userlist_url = 'http://tilde.town/~um/test.json';

function link_tilde_ring() {
    link_random_tildebox();
    link_random_user();
}

function add_event_listeners() {
    var ring_link = document.getElementById('tilde_town_ring'),
        rand_user_link = document.getElementById('random_user'),
        rand_box_link  = document.getElementById('random_tildebox');

    ring_link.addEventListener('click', link_tilde_ring);
    rand_user_link.addEventListener('click', link_tilde_ring);
    rand_box_link.addEventListener('click', link_tilde_ring);
}

// get ~user (minus ~)
function user() {
    return window.location.pathname.split('/')[1].split('~')[1];
}

// this vanilla.js ajax approach copied from user dystroy's
// SO answer: http://stackoverflow.com/a/14388512/1187277
function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                if (callback) callback(data);
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send(); 
}

// TODO: serve othertildes.json in JSONP so that this scripts can just be
//       dropped into any page.
function link_random_tildebox() {
    fetchJSONFile( tildeboxlist_urls ,
                   function(data) {
                       var urls = normalize_tilde_urls( obj_values(data) );
                       document.getElementById('random_tildebox').href = random_item(urls);
                   });
}

// TODO: get tildes to store user JSON in standard location? Then the
//       `json` arg here could be omitted in lieu of a relative address
//       hard coded in the function body: e.g., '/users.json'.
function link_random_user() {
    // var user_list = document.getElementById('tilde_ring').getAttribute('userlist');
    var user_list = 'http://tilde.town/~um/test.json';

    fetchJSONFile( user_list,
                   function(users) {
                       delete users[user()];
                       var user_props   = normalize_for_random_user(obj_values(users)),
                           urls = user_props.map(function(o) { return o.homepage; });

                       document.getElementById('random_user').href = random_item(urls);
                       
                       // generates and attaches link to a tilde.town ring member
                       // should be cut out into its own function once it won't break anything
                       // for the current user (~karlen) to do so
                       var ring_members = user_props.filter(function(x){ return x.ringmember; }),
                           member_urls  = ring_members.map(function(o) { return o.homepage; }),
                           tilde_ring_link = document.getElementById('tilde_town_ring');
                       
                       if (tilde_ring_link) {tilde_ring_link.href = random_item(member_urls);};
                       
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

// "normalizing" tilde urls means removing traling slashes and
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

    return remove(trimmed_urls, host_tildebox);
}

function remove(array, x) {
    var index = array.indexOf(x);
    if ( index > -1 ) {
        array.splice(index, 1);
    };
    return array;
}

// "normalizing" for a random user means eliminating users who haven't
// edited their pages and removing the user who owns the current page
function normalize_for_random_user(users) {
    return users.filter(function(u) {return u.edited;});
}

// main function, to run when script loads.
if (document.getElementById('tilde_town_ring')) {add_event_listeners();};
link_tilde_ring();
