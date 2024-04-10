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
const searchCount = document.querySelector('.search-count');
let totalData = document.querySelector('#totaldata');
let curPage = document.querySelector('#currentpage');
let totalPage = document.querySelector('#totalpage');
const contTable = document.querySelector('.content-table-icon');
const sortIcon = document.querySelectorAll('.content-table-icon span');
const searchHistory = document.querySelector('.history-content');
const historyDisplay = document.querySelector('.search-history');
const pages = document.querySelector('.pagenum');
const pagesIcon = document.querySelector('.pages');
let currentPage;
let pageNum=[];

// 取得資料
function getData(){
    axios.get('https://hexschool.github.io/js-filter-data/data.json')
    .then(function (response) {
    data=response.data.filter((item)=>item.作物名稱!==null&&item.作物名稱!==""&&item.交易量!==0);
    showData=data;
    init();
    setTimeout('renderData(data,0,39)',1000);
});
};
getData();

// 初始化
function init(){
    let str="";
    str+=`<tr><td><td><td><td>資料載入中 請稍後.....<td><td><td></td></td></td></td></td></td></td></tr>`
    table.innerHTML=str;
    input.setAttribute('disabled',"");
    currentPage=1;
    setTimeout(initTimeOut,1000);
};

// 初始化延時內容
function initTimeOut(){
    taball.classList.add('tabact');
    tabBtn.classList.remove('tabban');
    input.removeAttribute('disabled');
    stText.textContent="全部";
    pagesIcon.setAttribute("style","display: flex");
    searchCount.setAttribute("style","display: block");
};


// 頁首初始化
header.addEventListener("click",(e)=>{
    tabBtnAll.forEach((item)=>{
        item.classList.remove('tabact');
    });
    tabBtn.classList.add('tabban');
    iconReset()
    historyDisplay.setAttribute("style","display: none");
    pagesIcon.setAttribute("style","display: none");
    searchCount.setAttribute("style","display: none");
    showData=data;
    searchHistoryData=[];
    init();
    setTimeout('renderData(data,0,39)',1000);
});

// 資料渲染
function renderData(dat,st,sp){
    let str="";
    let fd=dat.filter((item,index)=>st<=index&&index<=sp);
    let num=Math.ceil(dat.length/40);
    let count=(s,t,p)=>
    Array.from(
        {length: (t-s)/p+1},
        (value, index)=>s+index*p
    );
    pageNum=count(1,num,1);
    pageCount(currentPage);
    totalData.innerHTML=showData.length;
    curPage.innerHTML=currentPage;
    totalPage.innerHTML=pageNum.length;
    fd.forEach((item)=>{
        if(item.作物名稱.length>7){
            str+=`<tr><td class="ta-l ta-1-fz">${item.作物名稱}</td><td>${item.市場名稱}</td><td>${item.上價}</td><td>${item.中價}</td><td>${item.下價}</td><td>${item.平均價}</td><td>${item.交易量}</td></tr>`
        }else{
            str+=`<tr><td class="ta-l">${item.作物名稱}</td><td>${item.市場名稱}</td><td>${item.上價}</td><td>${item.中價}</td><td>${item.下價}</td><td>${item.平均價}</td><td>${item.交易量}</td></tr>`
        };
    });
    table.innerHTML=str;
};

// 計算頁數、更新
function pageCount(num){
    let str="";
    let showPage=[];
    if(num<4){
        showPage=pageNum.filter((item,index)=>index<5);
    }else if(num>3&&num<pageNum.length-1){
        showPage=pageNum.filter((item,index)=>(num-4)<index&&index<(num+2));
    }else{
        showPage=pageNum.filter((item,index)=>index>pageNum.length-6);
    }
    showPage.forEach((item)=>{
        str+=`<li><a href="#">${item}</a></li>`;
    });
    pages.innerHTML=str;
    pagesAll = document.querySelectorAll('.pagenum li');
    pageUpdate(num);
};

// 頁碼監聽
pages.addEventListener("click",(e)=>{
    if(e.target.nodeName=="A"){
        pagesAll.forEach((item)=>{
            item.classList.remove('pageact');
        });
        currentPage=parseInt(e.target.textContent);
        let sp=parseInt((((currentPage*4).toString())+"0"))-1;
        let st=sp-39;
        renderData(showData,st,sp);
        pageCount(currentPage);
    };
});

// 頁碼icon監聽
pagesIcon.addEventListener("click",(e)=>{
    if(e.target.nodeName=="A"){
        return;
    };
    if(e.target.id=="p-pre"){
        if(currentPage-1==0){
            e.preventDefault();
            alert("已是第一頁");
            return;
        };
        currentPage-=1;
    }else if(e.target.id=="p-nex"){
        if(currentPage+1>pageNum.length){
            e.preventDefault();
            alert("已是最後一頁");
            return;
        };
        currentPage+=1;
    }else if(e.target.id=="p-first"){
        if(currentPage-1==0){
            e.preventDefault();
            alert("已是第一頁");
            return;
        };
        currentPage=pageNum[0];
    }else if(e.target.id=="p-last"){
        if(currentPage+1>pageNum.length){
            e.preventDefault();
            alert("已是最後一頁");
            return;
        };
        currentPage=pageNum.length;
    };
    let sp=parseInt((((currentPage*4).toString())+"0"))-1;
    let st=sp-39;
    renderData(showData,st,sp);
    pageUpdate(currentPage);
});

// 頁碼文字更新
function pageUpdate(num){
    if(num<4){
        pagesAll[num-1].classList.add('pageact');
    }else if(num>3&&num<pageNum.length-1){
        pagesAll[2].classList.add('pageact');
    }else if(pageNum.length-num==1){
        pagesAll[3].classList.add('pageact');
    }else{
        pagesAll[4].classList.add('pageact');
    };
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
    iconReset()
    currentPage=1;
    if(target=="taball"){
        renderData(data,0,39);
        showData=data;
    }else if(target=="tabveg"){
        showData=data.filter((item)=>item.種類代碼=="N04");
        renderData(showData,0,39);
    }else if(target=="tabfru"){
        showData=data.filter((item)=>item.種類代碼=="N05");
        renderData(showData,0,39);
    }else if(target=="tabflo"){
        showData=data.filter((item)=>item.種類代碼=="N06");
        renderData(showData,0,39);
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
    iconReset()
    currentPage=1;
    renderData(showData,0,39);
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
    content.forEach((item)=>{
        str+=`<li><a href="#" style="color: #000">${item}</a></li>`
    });
    searchHistory.innerHTML=str;
};

// 搜尋紀錄搜尋
searchHistory.addEventListener("click",(e)=>{
    if(e.target.nodeName=="A"){
        e.preventDefault();
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
    iconReset();
    currentPage=1;
    renderData(tempData,0,39);
    showData=tempData;
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
        iconReset();
        target.classList.add("content-act-up");
        target.classList.remove("content-act-non");
        tempData.sort((a,b)=>{
            return a[value]-b[value];
        });
        currentPage=1;
        renderData(tempData,0,39);
        showData=tempData;
    }else if(target.classList.contains("content-act-up")){
        target.classList.remove("content-act-up");
        target.classList.add("content-act-down");
        tempData.sort((a,b)=>{
            return b[value]-a[value];
        });
        currentPage=1;
        renderData(tempData,0,39);
        showData=tempData;
    }else if(target.classList.contains("content-act-down")){
        target.classList.remove("content-act-down");
        target.classList.add("content-act-non");
        currentPage=1;
        renderData(showData,0,39);
    };
});

// 箭頭重置
function iconReset(){
    sortIcon.forEach((item)=>{
        item.classList.remove("content-act-up","content-act-down");
        item.classList.add("content-act-non");
    });
};