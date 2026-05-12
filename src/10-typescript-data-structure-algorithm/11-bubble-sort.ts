export function bubbleSort(items: number[]=[]){
    let  isSwapped= false;
    for(let iteration=0; iteration< items.length; iteration++){
        for(let jdx=1; jdx < items.length - iteration;jdx++){
            if (items[jdx] < items[jdx-1]) {
                let temp = items[jdx];
                items[jdx] = items[jdx-1];
                items[jdx-1]=temp;
                isSwapped = true;
            }
        }
        if (!isSwapped) {
            break;
        }
    }
    return items;
}

console.log(bubbleSort([1, 2, 3, 4, 5, 6, 7, 8]));