

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

function item_increment(name, change) {
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

function progressbar_day() {
    let progress_day = document.getElementById("progress_day");
    progress_day.value += 1;
    localStorage.setItem("seconds_elapsed", progress_day.value);
    if (progress_day.value == 100) {
        progress_day.value = 0;
        item_increment("days_elapsed", 1);
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
            item_increment(resource_id, resource_increment);
        }
    } else {
        if (progressbar_element.value == 0) {
            progressbar_element.value = 100;
            if (!resource_id && !resource_increment) return;
            item_increment(resource_id, resource_increment);
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

function buy(item) {
    // need to save item prices from the buy menu to local storage
    resources[list_of_stuff_you_can_get[item].resource].quantity -= Math.floor(list_of_stuff_you_can_get[item].price);
    resources[list_of_stuff_you_can_get[item].resource].multiplier *= list_of_stuff_you_can_get[item].multiplier.multiplier_increase;
    localStorage.setItem(list_of_stuff_you_can_get[item].resource, resources[list_of_stuff_you_can_get[item].resource].quantity)
    localStorage.setItem(list_of_stuff_you_can_get[item].resource + "_multi", resources[list_of_stuff_you_can_get[item].resource].multiplier);
    update_ui(list_of_stuff_you_can_get[item].resource);
    list_of_stuff_you_can_get[item].price *= 1.2;
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
    setInterval(set_progressbar, 1000, "progress_hunger", 1);
    setInterval(set_progressbar, 1000, "progress_thirst", 1);
    setInterval(set_progressbar, 1000, "progress_will", -1);
    draw_upgrade_ui();
}