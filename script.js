

let stuff = {
    interval_timers: [],
    current_selection: null,
    days_elapsed: 0,
    off_flag: true,
}


let resources = {
    tinder: {
        quantity: 0,
        multiplier: 1
    },
    berries: {
        quantity: 0,
        multiplier: 1
    },
    water: {
        quantity: 0,
        multiplier: 1
    },
}


let actions = {
    eat: {
        need: "hunger",
        resources: "food",
        bar: "progress_hunger",
    },
    sleep: {
        need: "drowsiness",
        resources: "tinder",
        bar: "progress_drowsiness"
    },
    rave: {
        need: "thirst",
        resources: "water",
        bar: "progress_thirst"
    }
}

let needs = {
    hunger: 0,
    thirst: 0,
    drowsiness: 0
}


function update_progressbars() {
    Object.keys(actions).forEach(key => {
        let need = actions[key].need;
        let bar = actions[key].bar;

        needs[need] += 1;

        update_progressbar(bar, needs[need]);
    })
}


function update_progressbar(bar, need_quantity) {
    let progressbar_element = document.getElementById(bar);
    progressbar_element.value = parseInt(need_quantity);
}


function gather(id, increment = 2) {
    let progressbar_increment = 1;
    stuff.off_flag = !stuff.off_flag;
    clear_timers();
    if (id != localStorage.getItem("current_id")) {
        document.getElementById("progress_gather").value = 0;
    }
    else if (stuff.off_flag) {
        return;
    }
    stuff.current_selection = id;
    localStorage.setItem("current_id", id);
    clear_EVERYTHING(id);
    stuff.interval_timers.push(setInterval(set_progressbar, 10, "progress_gather", progressbar_increment, id, increment));
}


function consoom(id, resource_id, decrement = -10) {    
    let bar = actions[id].bar;
    let need = actions[id].need;
    needs[need] += -1;
    update_progressbar(bar, needs[need]);
    return

    let progressbar_increment = 1;
    stuff.off_flag = !stuff.off_flag;
    clear_timers();
    if (id != localStorage.getItem("current_id")) {
        document.getElementById("progress_dally").value = 0;
    }
    else if (stuff.off_flag) {
        return;
    }
    stuff.current_selection = id;
    localStorage.setItem("current_id", id);
    clear_EVERYTHING(id);
    stuff.interval_timers.push(setInterval(set_progressbar, 30, "progress_dally", progressbar_increment, resource_id, decrement));
}


function clear_EVERYTHING(id) {
    clear_timers();
    if (stuff.current_selection === id) {
        stuff.current_selection = null;
        document.getElementById(id).style.borderStyle = 'outset';
        return;
    }
    let gather = document.getElementsByClassName("gather");
    for (var i = 0; i < gather.length; i++) {
        gather[i].style.borderStyle = 'outset';
    }
    document.getElementById(id).style.borderStyle = 'inset';
}


function update_ui(id) {
    document.getElementById(id + "_num").textContent = localStorage.getItem(id);
}


function set_item(name, change) {
    localStorage.setItem(name, change);
}


function increment_item(name, change, update_ui_flag = false) {
    const item = localStorage.getItem(name);
    !item ? localStorage.setItem(name, change) :
        localStorage.setItem(name, parseInt(item) + change);
    if (update_ui_flag) {
        update_ui(name);
    }
}


function clear_timers() {
    for (var i = 0; i < stuff.interval_timers.length; i++) {
        clearInterval(stuff.interval_timers[i]);
    }
}


function progressbar_day() {
    let progress_day = document.getElementById("progress_day");
    progress_day.value += 1;
    localStorage.setItem("seconds_elapsed", progress_day.value);
    if (progress_day.value == 100) {
        progress_day.value = 0;
        increment_item("days_elapsed", 1, true);
        document.getElementById("days_elapsed").innerHTML = localStorage.getItem("days_elapsed");
    }
}


function set_progressbar(progressbar_name, progressbar_increment, resource_id, resource_increment) {
    let progressbar_element = document.getElementById(progressbar_name);

    progressbar_element.value += parseInt(progressbar_increment);
    localStorage.setItem(progressbar_name, progressbar_element.value);

    if (progressbar_increment > 0) {
        if (progressbar_element.value == 100) {
            progressbar_element.value = 0;
            if (!resource_id && !resource_increment) return;
            increment_item(resource_id, resource_increment, true);
        }
    } else {
        if (progressbar_element.value == 0) {
            progressbar_element.value = 100;
            if (!resource_id && !resource_increment) return;
            increment_item(resource_id, resource_increment, true);
        }
    }
}


var list_of_stuff_you_can_get = {
    axe: {
        resource: "tinder",
        price: 100,
        multiplier: {
            resource: tinder,
            multiplier_increase: 1.1
        }
    },
    bucket: {
        resource: "water",
        price: 100,
        multiplier: {
            resource: water,
            multiplier_increase: 1.1
        }
    },
    tarp: {
        resource: "berries",
        price: 100,
        multiplier: {
            resource: berries,
            multiplier_increase: 1.1
        }
    }
};


function draw_upgrade_ui(upgrade) {
    // clear ui
    document.getElementById("upgrades").innerHTML = "";
    console.log(list_of_stuff_you_can_get);

    for (const [key, value] of Object.entries(list_of_stuff_you_can_get)) {
        document.getElementById("upgrades").innerHTML += `<button type='button' id='${key}' class='gather' onclick='buy("${key}")'>${key} - ${Math.floor(value.price)} ${value.resource}</button>`;
    }
}


function buy(item_name) {
    // need to save item prices from the buy menu to local storage
    let item = list_of_stuff_you_can_get[item_name];
    let resource = resources[item.resource];
    resource.quantity -= Math.floor(item.price);
    resource.multiplier *= item.multiplier.multiplier_increase;
    localStorage.setItem(item.resource, resource.quantity);
    localStorage.setItem(item.resource + "_multi", resource.multiplier);
    update_ui(item.resource);
    item.price *= 1.1;
    draw_upgrade_ui();
    // need to apply the multiplier to gathering. decrease 
}


{
    let inventory = document.getElementsByClassName("inv");
    for (var i = 0; i < inventory.length; i++) {
        inventory[i].innerHTML = localStorage.getItem(
            inventory[i].id.substring(0, inventory[i].id.length - "_num".length));
    }

    // get item count from local storage
    for (const [key] of Object.entries(resources)) {
        resources[key].quantity = localStorage.getItem(key);
        let resource_multi = localStorage.getItem(key + "_multi");
        resource_multi > 0 ? resources[key].multiplier = resource_multi : resources[key].multiplier = 1;
    }

    document.getElementById("days_elapsed").innerHTML = localStorage.getItem("days_elapsed");
    document.getElementById("progress_day").value = localStorage.getItem("seconds_elapsed");
    setInterval(progressbar_day, 1000);
    setInterval(increment_item, 1000, "progress_hunger", 1);
    setInterval(increment_item, 1000, "progress_thirst", 1);
    setInterval(increment_item, 1000, "progress_drowsiness", 1);
    setInterval(update_progressbars, 1000);
    // setInterval(set_progressbar, 1000, "progress_hunger", 1);
    // setInterval(set_progressbar, 1000, "progress_thirst", 1);
    // setInterval(set_progressbar, 1000, "progress_drowsiness", 1);
    // setInterval(set_progressbar, 1000, "progress_dread", 1);
    // setInterval(set_progressbar, 1000, "progress_mania", 1);
    // draw_upgrade_ui();
}