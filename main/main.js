'use strict';

function printReceipt(inputs){
    var itemObject = countNumOfEachItem(inputs);
    var total=0.00;
    var discountedMoney=0;
    var result = '***<没钱赚商店>收据***\n'
    for(var barcode in itemObject){
        let item = getItemByBarcode(barcode);
        let num = itemObject[barcode];
        let subTotal = getSubTotal(item, num);
        discountedMoney += subTotal;
        total += Number(item.price * num);
        result += `名称：${item.name}，数量：${num}${item.unit}，单价：${item.price.toFixed(2)}(元)，小计：${subTotal.toFixed(2)}(元)\n`;
        // '名称：'+ item.name +'，数量：'+ num + item.unit + '，单价：'+ item.price.toFixed(2) +'(元)，小计：'+ (item.price * num).toFixed(2) +'(元)';
    }
    result+=`----------------------\n总计：${discountedMoney.toFixed(2)}(元)\n节省：${(total - discountedMoney).toFixed(2)}(元)\n**********************`;

    console.log(result);
}

function countNumOfEachItem(inputs){
    var itemObject = {};
    // TODO 可以改成用reduce实现
    inputs.map(tag => {
        let splitTag = tag.split('-');
        if(splitTag.length===1){
            if(itemObject[tag]){
                itemObject[tag]++;
            } else {
                itemObject[tag]=1;
            }
        } else {
            let barcode = splitTag[0];
            let num = Number(splitTag[1]);
            if(itemObject[barcode]){
                itemObject[barcode]+=num;
            } else {
                itemObject[barcode]=num;
            }
        }
    });
    return itemObject;
}

function getItemByBarcode(barcode){
    var allItems = loadAllItems();
    return allItems.find(item => item.barcode == barcode);
}

function getSubTotal(item, num){
    var discountMoney=0.00;
    var subTotal = item.price * num;
    if(isPromoteItem(item.barcode)){
        discountMoney = getDiscountMoney(item, num);
        subTotal-=discountMoney;
    }
    return subTotal;
}

function isPromoteItem(barcode){
    var promotions = loadPromotions();
    var promotion = promotions.find(promotion => promotion.type === 'BUY_TWO_GET_ONE_FREE');
    return promotion.barcodes.includes(barcode);
}

function getDiscountMoney(item, num){
    var price = item.price;
    var freeNum = Math.floor(num / 3);
    return freeNum * price;
}
