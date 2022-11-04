const alphabet = [
    "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
    "a1","b1","c1","d1","e1","f1","g1","h1","i1","j1","k1","l1","m1","n1","o1","p1","q1","r1","s1","t1","u1","v1","w1","x1","y1","z1",
    "a2","b2","c2","d2","e2","f2","g2","h2","i2","j2","k2","l2","m2","n2","o2","p2","q2","r2","s2","t2","u2","v2","w2","x2","y2","z2"
];


let pubFunctionAmount = 0;
let matrix;

function calcFactor(sx, sy, tx, ty){
    return(-matrix.getValue(tx, ty)/matrix.getValue(sx, sy))
}
function createIbox(amount){
    destroyIbox();
    iBox = document.getElementById("iBoxes");
    for(let i = 0; i < amount; i++){
        iBox.innerHTML += genIboxCreationHTML(amount);
    }
}
function genIboxCreationHTML(amount){
    let functionPart = '<div>';
    for(i = 1; i < amount; i++){
        let sqr = amount - i;
        let chr = alphabet[i-1];
        functionPart += '<input class="functionInformtion" type="number" value="0" style="width: 40px; border: 0px;"> &times ' + chr + " + ";
    }
    functionPart += '<input class="functionInformtion" type="number" value="0" style="width: 40px; border: 0px;"> &times ' + alphabet[amount - 1] + ' = <input class="functionInformtion" type="number" value="0" style="width: 40px; border: 0px;">';
    functionPart += "</div>"
    return functionPart
}
function destroyIbox(){
    iBox = document.getElementById("iBoxes");
    iBox.innerHTML = "";
}
function generateTableHTML(){
    oBox = document.getElementById("oBoxes");
    let firstRow = '<br><table class="matrix" style="width: 50%">' + genTableHead() + genTableBody() + '</table><br>'
    oBox.innerHTML += firstRow;
}
function genTableHead(){
    let head = '<tr class="matrixtr">';
    for(i = 0; i < pubFunctionAmount; i++){
        head += '<th class="matrixth" style="width:' + 90 / pubFunctionAmount + '%">' + alphabet[i] + '</th>'
    }
    head += '<th>|</th><th class="matrixth">=</th></tr>'
    return head
}
function genTableBody(){
    let body = '';
    for(y = 0; y < pubFunctionAmount; y++){
        body += '<tr class="matrixtr">'
        for(x = 0; x < pubFunctionAmount; x++){
            body += '<td class="matrixtd">' + matrix.getValue(x,y).toFixed(3) + '</td>'
        }
        body += '<th style="width: 20px">|</th>'
        body += '<td class="matrixtd">' + matrix.getValue(pubFunctionAmount,y).toFixed(3) + '</td>'
        body += '</tr>'
    }
    return body
}
function genResTableHead(){
    let head = '<tr class="matrixtr">';
    for(i = 0; i < pubFunctionAmount; i++){
        head += '<th class="matrixth" style="width:' + 90 / pubFunctionAmount + '%">' + alphabet[i] + '</th>'
    }
    return head
}
function genResTableBody(){
    let body = '';
    for(y = 0; y < pubFunctionAmount; y++){
        body += '<td class="matrixtd">' + matrix.getValue(matrix.horiSize - 1, y).toFixed(10) + '</td>'
    }
    body += '</tr>'
    return body
}
function loadData(){
    pubFunctionAmount = parseInt(document.getElementById("amountOfFunctions").value);
    allInputarr = [];
    data = document.getElementsByClassName("functionInformtion");
    let values = Array.from(data);
    values.forEach(element => {
        allInputarr.push(parseFloat(element.value));
    });
    let twoDimArr = new Array(pubFunctionAmount);
    for(i = 0; i < twoDimArr.length; i++){
        twoDimArr[i] = new Array(pubFunctionAmount);
    }
    let idx = 0;
    for(i = 0; i < twoDimArr.length; i++){
        for(j = 0; j < pubFunctionAmount-1; j++){
            twoDimArr[i][j] = allInputarr[idx];
            idx = idx + 1;
        }
        twoDimArr[i][pubFunctionAmount - 1] = allInputarr[idx];
        twoDimArr[i][pubFunctionAmount] = allInputarr[idx + 1];
        idx = idx + 2;
    }
    matrix = new Matrix(twoDimArr);
}
function combineToTriangle(){
    for(a = 0; a < pubFunctionAmount; a++){
        matrix.getOneAt(a, a);
        generateTableHTML();
        for(b = 1 + a; b < pubFunctionAmount; b++){
            matrix.combineFunction(a, b, calcFactor(a, a, a, b));
            generateTableHTML();
        }
    }
    console.log("Tirangle Form Finished");
    for(let outterIterator = 1; outterIterator < matrix.horiSize - 1; outterIterator++){
        for(let innerIterator = outterIterator - 1; innerIterator >= 0; innerIterator--){
            matrix.combineFunction(outterIterator, innerIterator, -matrix.getValue(outterIterator, innerIterator));
            generateTableHTML();
        }
    }
    rBox = document.getElementById("rBoxes");
    rBox.innerHTML += '<br><table class="matrix" style="width: 50%">' + genResTableHead() + '</tr>' + genResTableBody() + '</table><br>'
}
function main(){
    loadData();
    generateTableHTML();
    combineToTriangle();
}
class Matrix {
    constructor(twoDimArr){
        this.twoDimArr = twoDimArr;
        this.vertSize = twoDimArr.length;
        this.horiSize = twoDimArr[0].length;
    }
    print() {
        for(i = 0; i < this.vertSize; i++){
            console.log(this.twoDimArr[i]);
        }
    }
    getValue(x,y){
        return(this.twoDimArr[y][x])
    }
    setValue(x, y, value){
        this.twoDimArr[y][x] = value;
    }
    combineFunction(y1, y2, factor){
        for(let iterator = 0; iterator < this.horiSize; iterator++){
            this.twoDimArr[y2][iterator] = (this.twoDimArr[y2][iterator] + this.twoDimArr[y1][iterator] * factor);
        }
    }
    switchFunction(c, d){
        let tmp = this.twoDimArr[c];
        this.twoDimArr[c] = this.twoDimArr[d]
        this.twoDimArr[d] = tmp;
    }
    getOneAt(x, y){
        let foundOneInLoop = false;
        if(y == 0){
            for(let indx = 0; indx < this.vertSize; indx++){
                if(this.getValue(x, indx) == 1){
                    this.switchFunction(indx, y);
                    foundOneInLoop = true;
                }
            }
        }
        if(!foundOneInLoop){
            let tmp = this.getValue(x, y);
            for(let someIndexName = 0; someIndexName < this.horiSize; someIndexName++){
                this.setValue(someIndexName, y, this.getValue(someIndexName, y) / tmp);
            }
        }
    }
}