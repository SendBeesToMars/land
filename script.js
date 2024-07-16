

let stuff = {
    interval_timers: [],
    current_selection: null,
}

{
    let inventory = document.getElementsByClassName("inv");
    for (var i = 0; i < inventory.length; i++) {
        inventory[i].innerHTML = localStorage.getItem(
            inventory[i].id.substring(0, inventory[i].id.length - "_num".length));
    }
}

function gather(id, increment = 2) {
    clear_EVERYTHING(id);
    stuff.interval_timers.push(setInterval(item_update, 500, id, increment));
}

function consoom(id, resource_id, decrement = -10) {
    clear_EVERYTHING(id)
    stuff.interval_timers.push(setInterval(item_update, 500, resource_id, decrement));
}

function clear_EVERYTHING(id) {
    clear_timers();
    if (stuff.current_selection  === id){
        stuff.current_selection = null;
        document.getElementById(id).style.borderStyle = 'outset';
        return;
    }
    stuff.current_selection = id;
    let gather = document.getElementsByClassName("gather");
    for (var i = 0; i < gather.length; i++) {
        gather[i].style.borderStyle = 'outset';
    }
    document.getElementById(id).style.borderStyle = 'inset';
}

function update_ui(id) {
    document.getElementById(id + "_num").textContent = localStorage.getItem(id);
}

function item_update(name, change) {
    const item = localStorage.getItem(name);
    !item ? localStorage.setItem(name, change) :
        localStorage.setItem(name, parseInt(item) + change);
    update_ui(name);
}

function clear_timers() {
    for (var i = 0; i < stuff.interval_timers.length; i++) {
        clearInterval(stuff.interval_timers[i]);
    }
}