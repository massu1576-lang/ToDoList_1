"use strict";
const storage = localStorage;

const table = document.querySelector("table");
const todo = document.getElementById("todo");
const priority = document.querySelector("select");
const deadline = document.querySelector("input[type='date']");
const submit = document.getElementById("submit");

const br = document.createElement("br");

let list = [];

document.addEventListener("DOMContentLoaded", () => {
    const json = storage.todoList;
    if(json == undefined){
        return;
    }
    list = JSON.parse(json);
    for(const item of list){
        addItem(item);
    }
});

submit.addEventListener("click", () => {
    const item = {};
    if(todo.value != ""){
        item.todo = todo.value;     
    }else{
        item.todo = "ダミーtext";
    }
    item.priority = priority.value;
    if(deadline.value != ""){
        item.deadline = deadline.value;
    }else{
        // alert("期日を入力してください");
        // return;
        const date = new Date();
        item.deadline = date.toLocaleDateString().replaceAll(/\//g,"-");
    }
    item.done = false;

    todo.value = "";
    priority.value = "普";
    deadline.value = "";

    // 入力した要素をテーブルに追加
    addItem(item);

    // ローカルストレージに保存
    list.push(item);
    storage.todoList = JSON.stringify(list);   
});

const addItem = (item) => {
    const tr = document.createElement("tr");

    for(const prop in item){
        const td = document.createElement("td");
        if(prop == "done"){
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = item[prop];
            td.appendChild(checkbox);
            checkbox.addEventListener("change", (ev) => {
                item.done = ev.currentTarget.checked;
                storage.todoList = JSON.stringify(list);
            });
        }else{
            td.textContent = item[prop];
        }
        tr.appendChild(td);
    }
    table.append(tr);
};

const filterButton = document.createElement("button");
filterButton.textContent = "優先度「高」で絞込❣";
filterButton.id = "priority";
const main = document.querySelector("main");
main.appendChild(filterButton);

const resetButton = document.createElement("button");
resetButton.textContent = "絞り込みをやめる♦";
resetButton.id = "reset";

// テーブルのヘッダー以外を削除
const clearTable = () => {
    const trList = Array.from(document.getElementsByTagName("tr"));
    trList.shift();
    for(const tr of trList){
        tr.remove();
    }
};

// 優先度「高」で絞込
filterButton.addEventListener("click", () => {
    clearTable();
    for(const item of list){
        if(item.priority == "高"){
            addItem(item);
        }
    }
    main.removeChild(filterButton);
    main.appendChild(resetButton);
});

// 絞込後のリセットボタン
resetButton.addEventListener("click", () => {
    clearTable();
    for(const item of list){
        addItem(item);
    }
    main.removeChild(resetButton);
    main.appendChild(filterButton);
});

// 完了したTODOを削除する
const remove = document.createElement("button");
remove.textContent = "完了したToDoを削除♠";
remove.id = "remove";
const last = document.querySelector(".last");
last.appendChild(remove);

remove.addEventListener("click", () => {
    clearTable();
    list = list.filter((item) => item.done == false);
    for(const item of list){
        addItem(item);
    }
    storage.todoList = JSON.stringify(list);
});

// const checkBoxLister = (ev) => {
//     const trList = Array.from(document.getElementsByTagName("tr"));
//     const currentTr = ev.currentTarget.parentElement.parentElement;
//     const idx = trList.indexOf(currentTr) - 1;
//     list[idx].done = ev.currentTarget.checked;
//     storage.todoList = JSON.stringify(list);
// };