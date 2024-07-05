

let interval_timers = [];
let current_selection = null;

function initialise_ui() {
    let inventory = document.getElementsByClassName("inv");
    for (var i = 0; i < inventory.length; i++) {
        inventory[i].innerHTML = localStorage.getItem(inventory[i].id.substring(0, inventory[i].id.length - 4));
    }
}
initialise_ui();

function gather(id) {
    clear_timers();
    if (current_selection  === id){
        current_selection = null;
        document.getElementById(id).style.borderStyle = 'outset';
        return;
    }
    current_selection = id;
    let gather = document.getElementsByClassName("gather");
    for (var i = 0; i < gather.length; i++) {
        gather[i].style.borderStyle = 'outset';
    }
    document.getElementById(id).style.borderStyle = 'inset';
    
    const intervalID = setInterval(increment_item, 500, id, 1);
    interval_timers.push(intervalID);
}

function update_ui(id) {
    document.getElementById(id + "_num").textContent = localStorage.getItem(id);
}

function increment_item(name, increment) {
    const item = localStorage.getItem(name);
    if (item < 1) {
        localStorage.setItem(name, 1);
    }else{
        localStorage.setItem(name, parseInt(item) + increment);
    }
    console.log(localStorage.getItem(name));
    update_ui(name);
}

function clear_timers() {
    for (var i = 0; i < interval_timers.length; i++) {
        clearInterval(interval_timers[i]);
    }
}