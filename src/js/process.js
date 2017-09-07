const fs = require("fs");
const {
    BrowserWindow,
    dialog
} = require('electron').remote;

function loadConfig() {
    let win = BrowserWindow.getFocusedWindow();
    dialog.showOpenDialog(
        win, {
            properties: ["openFile"],
            filters: [{
                name: "config file",
                extensions: ["json"]
            }]
        },
        (file) => {
            if (file) {
                render(fs.readFileSync(file[0]).toString());
            }
        }
    );
}

function render(jsonStr) {
    let str = "\n\n";
    let jsonConfig = JSON.parse(jsonStr);

    str += `<section id="numerical">${_render(jsonConfig, "numerical")}</section>`;
    str += `<section id="single-choice">${_render(jsonConfig, "single-choice")}</section>`;
    str += `<section id="multi-choice">${_render(jsonConfig, "multi-choice")}</section>`;
    document.getElementById('container').innerHTML = str;
    showSaveButton();
}

function _render(config, type) {
    let str = "";
    let _config = config[type];
    for (let key in _config) {
        str += `<h2>${key}</h2>`;

        switch (type) {
            case "numerical":
                str += `
                <div class="mdc-form-field">
                    <div class="mdc-textfield">
                        <input type="text" class="mdc-textfield__input echood-numerical" id="${key}" value="${_config[key]}">
                    </div>
                </div>`;
                break;
            case "single-choice":
                for (let index in _config[key]) {
                    let choice = _config[key][index];
                    let checkOrNot = (index == 0) ? "checked" : "";
                    str += `
                    <div class="mdc-form-field">
                        <div class="mdc-radio">
                            <input class="mdc-radio__native-control echood-single-choice" type="radio" id="${key + choice}" name="${key}" ${checkOrNot} />
                            <div class="mdc-radio__background">
                                <div class="mdc-radio__outer-circle"></div>
                                <div class="mdc-radio__inner-circle"></div>
                            </div>
                        </div>
                        <label for="${key + choice}" id="${key + choice + "_label"}">${choice}</label>
                    </div>
                    `;
                }
                break;
            case "multi-choice":
                let choices = _config[key]
                // choices[0]: default values
                for (let index in choices[0].concat(choices.slice(1))) {
                    let choice = choices[index];
                    let checkOrNot = (index < choices[0].length) ? "checked" : "";
                    str += `
                    <div class="mdc-list">
                        <span class="mdc-list-item">${choice}</span>
                        <div class="mdc-switch">
                            <input type="checkbox" id="${key + choice}" name="${key}" class="mdc-switch__native-control echood-multi-choice" ${checkOrNot} />
                            <div class="mdc-switch__background">
                                <div class="mdc-switch__knob"></div>
                            </div>
                        </div>
                        <label for="${key + choice}" class="mdc-switch-label">off/on</label>
                    </div>
                    `;
                }
                break;
        }
    }
    return str;
}

function saveFilledData() {
    writeData(getFilledData());
}

function getFilledData() {
    let jsonObj = {};
    let getKey = (e) => e.name;
    let getChoice = (e) => e.id.slice(e.name.length, e.id.length);
    let nElements = document.getElementsByClassName("echood-numerical");
    nElements.forEach((e) => {
        jsonObj[e.id] = Number(e.value);
    });
    let sElements = document.getElementsByClassName("echood-single-choice");
    let sKeys = new Set(sElements.map((e) => getKey(e)));
    sKeys.forEach((k) => {
        jsonObj[k] = sElements.map((e) => [getKey(e), e]) // key -> elem
            .filter((p) => p[0] === k) // if key is k
            .filter((p) => p[1].checked)
            .map((p) => getChoice(p[1]))[0]; // if elem.checked. non-array is needed
    });
    let mElements = document.getElementsByClassName("echood-multi-choice");
    let mKeys = new Set(mElements.map((e) => getKey(e)));
    mKeys.forEach((k) => {
        jsonObj[k] = mElements.map((e) => [getKey(e), e]) // key -> elem
            .filter((p) => p[0] === k) // if key is k
            .filter((p) => p[1].checked)
            .map((p) => getChoice(p[1])); // if elem.checked.
    });
    return jsonObj;
}

function writeData(data) {
    let win = BrowserWindow.getFocusedWindow();
    dialog.showOpenDialog(
        win, {
            properties: ["openDirectory"],
        },
        (dir) => {
            let configFile = dir.toString() + "/config.json";
            if (dir) {
                let configFileJson = (fs.existsSync(configFile)) ? JSON.parse(fs.readFileSync(configFile)) : {};
                let key = Date.now().toString();
                configFileJson[key] = data;
                fs.writeFileSync(configFile, JSON.stringify(configFileJson));
                changeButtonColor();
                showSavedKey(key);
            }
        }
    );
}

function changeButtonColor() {
    showSaveDoneButton();
    (async() => {
        // color changing for 2 sec
        await sleep(2000);
        showSaveButton();
    })();
}

const showSaveButton = () => document.getElementById('save_button').innerHTML =
`<button class="mdc-button mdc-button--raised mdc-button--primary" onclick="saveFilledData()">save</button>`;
const showSaveDoneButton = () => document.getElementById('save_button').innerHTML =
`<button class="mdc-button mdc-button--raised mdc-button--accent" onclick="saveFilledData()">saved</button>`;
const showSavedKey = (key) => document.getElementById('saved_name').innerHTML = `
    <button class="clipboard copy_button mdc-button mdc-button--raised" data-clipboard-text="${key}" title="copy">
        <code>${key}</code>
    </button>`;
const sleep = (msec) => new Promise(resolve => setTimeout(resolve, msec));

HTMLCollection.prototype.forEach = Array.prototype.forEach;
HTMLCollection.prototype.map = Array.prototype.map;
HTMLCollection.prototype.filter = Array.prototype.filter;
