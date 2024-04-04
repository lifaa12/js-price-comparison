let data=[];
let showData=[];
let searchHistoryData=[];
const header = document.querySelector('h1');
const table = document.querySelector('.table');
const tabBtn = document.querySelector('.tab');
const tabBtnAll = document.querySelectorAll('.tab li');
const taball = document.querySelector('#taball');
const stText = document.querySelector('.status-text');
const input = document.querySelector('input');
const serBtn = document.querySelector('.serbtn');
const select = document.querySelector('.select');
const searchDiv = document.querySelector('.search');
const contTable = document.querySelector('.content-table-icon');
const sortIcon = document.querySelectorAll('.content-table-icon span');
const searchHistory = document.querySelector('.history-content');
const historyDisplay=document.querySelector('.search-history');

// 取得資料
function getData(){
    axios.get('https://hexschool.github.io/js-filter-data/data.json')
    .then(function (response) {
    data=response.data.filter((item)=>item.作物名稱!==null&&item.作物名稱!==""&&item.交易量!==0);
    showData=data;
    init();
    setTimeout('renderData(data)',1000);
});
};
getData();

// 初始化
function init(){
    let str="";
    str+=`<tr><td><td><td><td>資料載入中 請稍後.....<td><td><td></td></td></td></td></td></td></td></tr>`
    table.innerHTML=str;
    input.setAttribute('disabled',"");
    searchHistoryData=[];
    historyDisplay.setAttribute("style","display: none");
    setTimeout(initTimeOut,1000);
};

// 初始化延時內容
function initTimeOut(){
    taball.classList.add('tabact');
    tabBtn.classList.remove('tabban');
    input.removeAttribute('disabled');
    stText.textContent="全部";
};


// 頁首初始化
header.addEventListener("click",(e)=>{
    tabBtnAll.forEach((item)=>{
        item.classList.remove('tabact');
    });
    tabBtn.classList.add('tabban');
    searchDiv.classList.add('serban');
    init();
    setTimeout('renderData(data)',1000);
});

// 資料渲染
function renderData(dat){
    let str="";
    dat.forEach((item)=>{
        if(item.作物名稱.length>8){
            str+=`<tr><td class="ta-l ta-1-fz">${item.作物名稱}</td><td>${item.市場名稱}</td><td>${item.上價}</td><td>${item.中價}</td><td>${item.下價}</td><td>${item.平均價}</td><td>${item.交易量}</td></tr>`
        }else{
            str+=`<tr><td class="ta-l">${item.作物名稱}</td><td>${item.市場名稱}</td><td>${item.上價}</td><td>${item.中價}</td><td>${item.下價}</td><td>${item.平均價}</td><td>${item.交易量}</td></tr>`
        }
    });
    table.innerHTML=str;
};

// tab切換
tabBtn.addEventListener('click',(e)=>{
    let target=e.target.id;
    if(target==""||tabBtn.classList.contains("tabban")){
        return;
    };
    stText.textContent=e.target.textContent;
    tabBtnAll.forEach((item)=>{
        item.classList.remove('tabact');
    });
    e.target.classList.add('tabact');
    select.value="排序篩選";
    if(target=="taball"){
        renderData(data);
    }else if(target=="tabveg"){
        showData=data.filter((item)=>item.種類代碼=="N04");
        renderData(showData);
    }else if(target=="tabfru"){
        showData=data.filter((item)=>item.種類代碼=="N05");
        renderData(showData);
    }else if(target=="tabflo"){
        showData=data.filter((item)=>item.種類代碼=="N06");
        renderData(showData);
    };
});

// 資料搜尋-主內容
function search(){
    if(input.disabled==true){
        alert("請等待資料載入完成");
        return;
    };
    if(input.value==""){
        alert("請輸入作物名稱");
        return;
    };
    showData=data.filter((item)=>item.作物名稱.match(input.value.trim()));
    if(showData.length==0){
        input.value="";
        alert("查無此作物");
        return;
    };
    tabBtnAll.forEach((item)=>item.classList.remove('tabact'));
    stText.textContent=input.value.trim();
    serHistory();
    input.value="";
    select.value="排序篩選";
    renderData(showData);
};

// 資料搜尋-按鈕監聽
serBtn.addEventListener("click",(search));

// 資料搜尋-鍵盤監聽
input.addEventListener("keyup",(e)=>{
    if(e.key=="Enter"){
        search();
    };
});

// 搜尋紀錄
function serHistory(){
    searchHistoryData.unshift(input.value);
    let content=searchHistoryData.filter((item,index)=>searchHistoryData.indexOf(item)==index);
    if(content.length>5){
        content.splice(5);
    };
    if(content.length!==0){
        historyDisplay.setAttribute("style","display: flex");
    };
    let str="";
    console.log(searchHistoryData);
    console.log(content);
    content.forEach((item)=>{
        str+=`<li><a href="#" style="color: #000">${item}</a></li>`
    });
    searchHistory.innerHTML=str;
};

// 搜尋紀錄搜尋
searchHistory.addEventListener("click",(e)=>{
    if(e.target.nodeName=="A"){
        input.value=e.target.textContent;
        search();
    };
});

// 資料排序-下拉選單
select.addEventListener("change",(e)=>{
    let tempData=showData.map(item=>({...item}));
    let value=e.target.value;
    switch(e.target.value){
        case e.target.value:
            tempData.sort((a,b)=>{
                return a[value]-b[value];
            });
            break;
    };
    sortIcon.forEach((item)=>{
        item.classList.remove("content-act-up","content-act-down");
        item.classList.add("content-act-non");
    });
    renderData(tempData);
});

// 資料排序-箭頭
contTable.addEventListener("click",(e)=>{
    if(e.target.nodeName!=="I"){
        return;
    };
    let target=e.target.closest("span");
    let tempData=showData.map(item=>({...item}));
    let value=target.closest("th").textContent;
    select.value="排序篩選";
    if(target.classList.contains("content-act-non")){
        sortIcon.forEach((item)=>{
            item.classList.remove("content-act-up","content-act-down");
            item.classList.add("content-act-non");
        });
        target.classList.add("content-act-up");
        target.classList.remove("content-act-non");
        tempData.sort((a,b)=>{
            return a[value]-b[value];
        });
        renderData(tempData);
    }else if(target.classList.contains("content-act-up")){
        target.classList.remove("content-act-up");
        target.classList.add("content-act-down");
        tempData.sort((a,b)=>{
            return b[value]-a[value];
        });
        renderData(tempData);
    }else if(target.classList.contains("content-act-down")){
        target.classList.remove("content-act-down");
        target.classList.add("content-act-non");
        renderData(showData);
    };
});



// 分頁




// 資料筆數


