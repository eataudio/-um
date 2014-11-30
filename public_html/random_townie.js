
function id(x) { return x; }

function obj_own_keys(obj) {
   var temp_key, keys = [];
    for(temp_key in obj) {
       if(obj.hasOwnProperty(temp_key)) {
           keys.push(temp_key);
       }
    }
    return keys.sort();
}

function load_JSON_obj(source) {
    var obj = {};
    $.getJSON(source, function(data) {
        $.each( data,
                function(k,v) { obj[k] = v; });
    });
    return obj;
}

function get_other_tildes() {
    return $.map(load_JSON_obj('json/othertildes.json'), id);
}

function random_item(items) {
    return items[Math.floor(Math.random()*items.length)];
}
// ADDRESS FOR USERS: "http://tilde.town/~dan/users.json"

// function load_JSON_obj(id) {
//     var iframe   = document.getElementById(id),
//         JSON_str = iframe.contentWindow.document.body.childNodes[0].innerHTML;
//     return JSON.parse(JSON_str);
// }

// function tilde_ring() {
//     var rand_user_link  = document.getElementById("random_user"),
//         // rand_tilde_link = document.getElementById("random_tildebox"),
//         this_tilde = window.location.hostname,
//         // tildes = load_JSON_obj("tildesJSON"),
//         // tilde_names = obj_own_keys(tildes),
 
//         users      = load_JSON_obj("usersJSON"),
//         user_names = obj_own_keys(users);

//     rand_user_link.href = users[random_item(user_names)].homepage;
//     rand_user_link.innerHTML = "random " + this_tilde + " ~user";

//     // rand_tilde_link.href = tildes[random_item(tilde_names)].homepage;
// }
